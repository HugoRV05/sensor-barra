// Para que la app abra sin cobertura (gimnasios en sótanos): se guarda lo
// último que se descargó. Siempre se intenta primero la red, así que una
// versión nueva llega en cuanto hay conexión.
const CACHE = 'sensor-barra-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: e.request.mode === 'navigate' }).then((hit) => hit ?? Response.error())),
  );
});
