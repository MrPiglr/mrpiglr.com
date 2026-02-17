/* eslint-disable no-restricted-globals */

    const CACHE_NAME = 'mrpiglr-cache-v1';
    const urlsToCache = [
      '/',
      '/index.html',
      '/manifest.json',
      '/favicon.svg',
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png'
    ];
    
    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
          })
      );
    });
    
    self.addEventListener('fetch', (event) => {
      const url = new URL(event.request.url);
      
      // Don't cache source files, HMR, or WebSocket connections
      const skipCaching = url.pathname.startsWith('/src/') || 
                         url.pathname.endsWith('.jsx') ||
                         url.pathname.endsWith('.js') ||
                         event.request.url.includes('@vite');
      
      if (skipCaching) {
        // For dev files, always fetch fresh
        event.respondWith(
          fetch(event.request).catch(() => {
            return new Response('Network error', { status: 503 });
          })
        );
        return;
      }
      
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
    
            const fetchRequest = event.request.clone();
    
            return fetch(fetchRequest).then(
              (response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
    
                const responseToCache = response.clone();
    
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
    
                return response;
              }
            ).catch(() => {
              // Network error - return cached version if available
              return caches.match(event.request);
            });
          })
      );
    });
    
    self.addEventListener('activate', (event) => {
      const cacheWhitelist = [CACHE_NAME];
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });