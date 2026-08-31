const CACHE_NAME = 'cetin-cache-v1';
const MAP_CACHE_NAME = 'cetin-map-tiles-v1';

// Recursos estáticos para cachear
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Dominios de tiles del mapa para cachear
const MAP_TILE_DOMAINS = [
  'tiles.stadiamaps.com',
  'api.maptiler.com',
  'tile.openstreetmap.org'
];

// Desactivar el Service Worker eliminando su contenido
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activar y limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== MAP_CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Validar respuestas antes de usarlas
function isValidResponse(response) {
  return response && response.ok;
}

// Manejo de errores global
function handleFetchError() {
  return new Response('Error al procesar la solicitud', { status: 500 });
}

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar esquemas que Cache API y fetch no pueden manejar.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Cachear tiles del mapa con estrategia Cache First
  if (MAP_TILE_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(
      caches.open(MAP_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            fetch(event.request).then((networkResponse) => {
              if (isValidResponse(networkResponse)) {
                cache.put(event.request, networkResponse.clone());
              }
            }).catch(() => {});
            return cachedResponse;
          }

          return fetch(event.request).then((networkResponse) => {
            if (isValidResponse(networkResponse)) {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }
            return handleFetchError();
          }).catch(handleFetchError);
        });
      })
    );
    return;
  }

  // Para Google Fonts - Cache First
  if (url.hostname.includes('fonts.googleapis.com') || 
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Para imágenes - Cache First con fallback
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          // Fallback para imágenes que fallan
          return new Response('', { status: 404 });
        });
      })
    );
    return;
  }

  // Para otros recursos - Network First con fallback a cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (isValidResponse(networkResponse)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        }
        return handleFetchError();
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || handleFetchError();
        });
      })
  );
});

// Limpiar cache de tiles del mapa periódicamente (max 500 tiles)
self.addEventListener('message', (event) => {
  if (event.data === 'cleanMapCache') {
    caches.open(MAP_CACHE_NAME).then((cache) => {
      cache.keys().then((keys) => {
        if (keys.length > 500) {
          // Eliminar los primeros 100 tiles (más antiguos)
          keys.slice(0, 100).forEach((key) => {
            cache.delete(key);
          });
        }
      });
    });
  }
});
