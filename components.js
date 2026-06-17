async function loadPartial(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    el.outerHTML = await res.text();
  } catch (e) {
    console.warn('Partial konnte nicht geladen werden:', url, e);
  }
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadPartial('site-header', '/partials/navbar.html'),
    loadPartial('site-footer', '/partials/footer.html'),
  ]);
  initMobileNav();
});
