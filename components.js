// ---- Preview Gate (vor Go-Live entfernen) ----
(function () {
  const HASH = '36e11b86750178bc2d659d7779dbfdf28cee8c60a6a804e47d3ef1ae85f4a70c';
  const KEY = 'ack_preview_auth';
  if (sessionStorage.getItem(KEY) === '1') return;

  const input = prompt('Passwort:');
  if (!input) {
    document.documentElement.innerHTML = '<p style="font-family:sans-serif;padding:2rem">Kein Zugriff.</p>';
    throw new Error('unauthorized');
  }

  crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then(buf => {
    const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    if (hex !== HASH) {
      document.documentElement.innerHTML = '<p style="font-family:sans-serif;padding:2rem">Kein Zugriff.</p>';
    } else {
      sessionStorage.setItem(KEY, '1');
    }
  });
})();
// ---- Ende Preview Gate ----

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
