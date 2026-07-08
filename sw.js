const CACHE = 'acb-v35';
const CORE = ['/', '/index.html', '/manifest.json', '/logo-acb.png', '/Falcioni.jpg', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  // Firebase / externos: sempre pela rede, sem cache
  if (url.includes('firestore') || url.includes('firebase') || url.includes('googleapis') || url.includes('gstatic')) return;

  // HTML / navegação → REDE PRIMEIRO (sempre a versão mais nova; offline cai no cache)
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put('/index.html', copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // Demais (imagens, manifest) → cache primeiro, atualizando em segundo plano
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(resp => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return resp;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
