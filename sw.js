// Nombre de la caché para esta versión de la app
const CACHE_NAME = 'diario-docente-v1'; 

// Lista de archivos esenciales que deben ser guardados en caché
const urlsToCache = [
    './index.html', // Actualizado a index.html
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

// Evento de Instalación: Guarda los archivos esenciales en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Archivos estáticos en caché.');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); // Fuerza la activación inmediata del nuevo SW
});

// Evento de Fetch: Intercepta peticiones para servir desde la caché si es posible
self.addEventListener('fetch', (event) => {
    // Para todas las peticiones (archivos o datos), intenta responder desde la caché.
    // Si no está en caché, va a la red.
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si encontramos algo en caché, lo retornamos.
                if (response) {
                    return response;
                }
                // Si no, hacemos la petición a la red.
                return fetch(event.request);
            })
    );
});

// Evento de Activación: Limpia cachés antiguas (opcional, pero buena práctica)
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Borra cachés que no están en la lista blanca
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});
