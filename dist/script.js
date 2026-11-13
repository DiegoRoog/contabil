'use strict';

const serviceData = {
  contabilidade: { title: 'Contabilidade empresarial', description: 'Números organizados para enxergar seu negócio com mais clareza e tomar decisões com confiança.', items: ['Organização da rotina contábil', 'Demonstrativos e leitura dos resultados', 'Acompanhamento das obrigações da empresa'] },
  tributario: { title: 'Planejamento tributário', description: 'Uma análise cuidadosa da estrutura da sua empresa para entender as escolhas e organizar o próximo passo.', items: ['Análise do enquadramento tributário', 'Revisão de processos e obrigações fiscais', 'Planejamento alinhado ao momento do negócio'] },
  pessoas: { title: 'Departamento pessoal', description: 'Cuidado com a rotina de quem faz sua empresa acontecer, com processos claros e atenção aos detalhes.', items: ['Organização da folha de pagamento', 'Rotinas de admissão e desligamento', 'Acompanhamento das obrigações trabalhistas'] },
  abertura: { title: 'Abertura de empresas', description: 'Da ideia à estrutura: um começo organizado para você dedicar energia ao que quer construir.', items: ['Orientação sobre a estrutura da empresa', 'Organização de documentos e registros', 'Planejamento dos primeiros passos contábeis'] }
};
const serviceDialog = document.querySelector('#service-dialog');
const bookingDialog = document.querySelector('#booking-dialog');
const processDialog = document.querySelector('#process-dialog');
const form = document.querySelector('#booking-form');
const mobileNav = document.querySelector('#mobile-nav');
const menuToggle = document.querySelector('.menu-toggle');
let selectedService = '';
let returnFocus = null;

function closeMenu() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = isOpen;
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 920) closeMenu(); });

function openDialog(dialog, trigger) {
  const candidate = trigger || document.activeElement;
  returnFocus = candidate && candidate.closest('#mobile-nav') ? menuToggle : candidate;
  document.body.classList.add('modal-open');
  dialog.showModal();
}
function closeDialog(dialog) { dialog.close(); }
document.querySelectorAll('.dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => closeDialog(dialog));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeDialog(dialog);
  });
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
  });
});

document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    selectedService = button.dataset.service;
    const data = serviceData[selectedService];
    document.querySelector('#service-dialog-title').textContent = data.title;
    document.querySelector('#service-dialog-description').textContent = data.description;
    const list = document.querySelector('#service-dialog-items');
    list.replaceChildren();
    data.items.forEach(item => {
      const li = document.createElement('li');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('icon');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#i-check');
      svg.append(use);
      li.append(svg, document.createTextNode(item));
      list.append(li);
    });
    openDialog(serviceDialog, button);
  });
});

function openBooking(trigger, service = '') {
  const effectiveTrigger = trigger && trigger.closest('dialog') ? returnFocus : trigger;
  closeMenu();
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  form.reset();
  document.querySelector('#booking-form-view').hidden = false;
  document.querySelector('#booking-success-view').hidden = true;
  bookingDialog.setAttribute('aria-labelledby', 'booking-title');
  form.elements.service.value = service;
  openDialog(bookingDialog, effectiveTrigger);
  bookingDialog.scrollTop = 0;
}
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => openBooking(button, button.dataset.bookService || '')));
document.querySelectorAll('[data-process]').forEach(button => button.addEventListener('click', () => {
  closeMenu();
  openDialog(processDialog, button);
  processDialog.scrollTop = 0;
}));
document.querySelector('#service-dialog-book').addEventListener('click', () => {
  const originalTrigger = returnFocus;
  serviceDialog.close();
  openBooking(originalTrigger, selectedService);
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const firstName = form.elements.name.value.trim().split(/\s+/)[0] || 'Olá';
  document.querySelector('#success-message').textContent = `${firstName}, você concluiu a demonstração do atendimento da Roog.`;
  form.reset();
  document.querySelector('#booking-form-view').hidden = true;
  document.querySelector('#booking-success-view').hidden = false;
  bookingDialog.setAttribute('aria-labelledby', 'success-title');
  bookingDialog.scrollTop = 0;
  document.querySelector('#success-title').focus();
});
document.querySelector('#booking-done').addEventListener('click', () => bookingDialog.close());
document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const navLinks = document.querySelectorAll('.desktop-nav a.nav-link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
  ['inicio', 'solucoes', 'sobre'].forEach(id => observer.observe(document.getElementById(id)));
}
