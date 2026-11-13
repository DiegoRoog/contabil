# Roog Contábil

Landing page de demonstração em HTML, CSS e JavaScript, sem framework ou dependências de execução. O código editável fica em `dist/`: essa pasta é a aplicação estática, não uma saída descartável de build.

## Executar e verificar

Abra `dist/index.html` no navegador ou execute `python -m http.server 4174 --directory dist` e acesse `http://localhost:4174`.

Verificações antes da publicação:

```text
node --check dist/script.js
python .github/scripts/check-site.py
```

Não há package.json, lockfile, TypeScript ou etapa de compilação. O site utiliza transições CSS, menu responsivo, diálogos, acordeões e navegação por seções. O formulário é demonstrativo: não transmite, salva nem agenda dados.

## GitHub Pages

Repositório: https://github.com/DiegoRoog/contabil

Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**. O workflow **Publish Roog Contábil** roda em pushes na branch `main` e pode ser iniciado manualmente em Actions.

Somente `dist/` é enviada ao Pages. O workflow valida os arquivos locais e a sintaxe JavaScript. As Actions oficiais são fixadas por SHA; não há instalação de pacotes nem serviços pagos. O Node 24 é usado apenas para validar a sintaxe.

O endereço esperado é `https://diegoroog.github.io/contabil/`. Considere a publicação concluída somente após o workflow terminar e o endereço responder com a página.

Fotografias e créditos: `CREDITS.md`. Licenças das fontes: `dist/fonts/`. Referências, capturas, backups e configurações privadas de prévia não integram o repositório.
