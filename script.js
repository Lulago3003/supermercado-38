const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '×' : '☰';
  });
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  }));
}

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('[data-page]').forEach((link) => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

const period = document.querySelector('[data-offer-period]');
if (period) {
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = new Date(now); monday.setDate(now.getDate() - mondayOffset);
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const fmt = new Intl.DateTimeFormat('es-PA', { day: 'numeric', month: 'short' });
  period.textContent = `Vigentes del ${fmt.format(monday)} al ${fmt.format(sunday)}`;
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach((item) => observer.observe(item));
} else document.querySelectorAll('[data-reveal]').forEach((item) => item.classList.add('visible'));

const quoteForm = document.querySelector('[data-quote-form]');
if (quoteForm) {
  const summary = quoteForm.querySelector('[data-quote-summary]');
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(quoteForm);
    const selected = data.getAll('interes');
    const lines = [
      'Hola, quiero solicitar una cotización en Supermercado 38.', '',
      `Nombre: ${data.get('nombre') || 'No indicado'}`,
      `Contacto: ${data.get('contacto') || 'No indicado'}`,
      `Tipo de solicitud: ${data.get('tipo') || 'No indicado'}`,
      `Interés: ${selected.length ? selected.join(', ') : 'No indicado'}`,
      `Presupuesto: ${data.get('presupuesto') || 'A definir'}`,
      `Fecha estimada: ${data.get('fecha') || 'A definir'}`,
      `Detalles: ${data.get('detalle') || 'Sin detalles adicionales'}`, '',
      'Agradezco su respuesta. ¡Gracias!'
    ];
    const message = lines.join('\n');
    if (summary) { summary.textContent = message; summary.classList.add('visible'); }
    window.open(`https://wa.me/50767676813?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}
document.querySelectorAll('[data-year]').forEach((year) => { year.textContent = new Date().getFullYear(); });
