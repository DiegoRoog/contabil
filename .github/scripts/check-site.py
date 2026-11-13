"""Validate exact static paths, including filename case for GitHub Pages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re

ROOT = Path(__file__).resolve().parents[2] / 'dist'

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.references, self.fragments = [], [], []
        self.h1 = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        self.h1 += tag == 'h1'
        for key in ('src', 'href'):
            value = attrs.get(key, '')
            if value.startswith('#'):
                self.fragments.append(value[1:])
            elif value and (key == 'src' or tag == 'link'):
                self.references.append(value)

assert (ROOT / 'index.html').is_file(), 'Missing dist/index.html'
assert (ROOT / '.nojekyll').is_file(), 'Missing dist/.nojekyll'
page = Page()
page.feed((ROOT / 'index.html').read_text(encoding='utf-8-sig'))
assert page.h1 == 1, 'Expected one primary heading'
assert len(set(page.ids)) == len(page.ids), 'Duplicate HTML IDs'
assert set(page.fragments) <= set(page.ids), 'Broken internal fragment'
visited = set()

def check(value, parent):
    url = urlsplit(value.strip())
    if url.scheme == 'data' or not url.path:
        return
    assert not url.scheme and not url.netloc, 'Runtime resource must be local'
    assert not url.path.startswith('/'), 'Resource breaks repository base path'
    candidate = (parent / unquote(url.path)).resolve()
    assert candidate.is_relative_to(ROOT.resolve()), 'Resource escapes website directory'
    assert candidate.is_file(), f'Missing resource: {candidate.name}'
    current = ROOT
    for part in candidate.relative_to(ROOT.resolve()).parts:
        assert part in {p.name for p in current.iterdir()}, f'Wrong filename case: {part}'
        current = current / part
    if candidate in visited:
        return
    visited.add(candidate)
    if candidate.suffix == '.css':
        for resource in re.findall(r'url\(\s*[\"\']?([^\)\"\']+)', candidate.read_text(encoding='utf-8-sig')):
            check(resource, candidate.parent)

for value in page.references:
    check(value, ROOT)
assert all(not p.is_symlink() for p in ROOT.rglob('*')), 'Symbolic links are not allowed'
print(f'PASS: index, IDs, fragments and {len(visited)} local resources, with exact filename case.')
