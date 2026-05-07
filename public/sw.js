/**
 * PRAX Studio - Service Worker
 * Provides offline support and intelligent caching for optimal performance
 */

const CACHE_VERSION = 'prax-v1.1.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
];

// Maximum number of items in dynamic cache
const MAX_DYNAMIC_CACHE = 50;
const MAX_IMAGE_CACHE = 100;

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Failed to cache some static assets:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('prax-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

/**
 * Fetch Event - Implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) return;

  // Skip analytics and external tracking
  if (url.hostname.includes('analytics') || url.hostname.includes('gtag')) {
    return;
  }

  event.respondWith(handleFetch(request));
});

/**
 * Handle fetch with appropriate caching strategy
 */
async function handleFetch(request) {
  const url = new URL(request.url);

  // Images from Vercel Blob - Cache-first strategy (long TTL, immutable URLs
  // when content-hash query param is present)
  if (url.hostname.endsWith('.public.blob.vercel-storage.com')) {
    return cacheFirst(request, IMAGE_CACHE, MAX_IMAGE_CACHE);
  }

  // Next.js optimized images (/_next/image?url=...) - Cache-first
  if (url.pathname.startsWith('/_next/image')) {
    return cacheFirst(request, IMAGE_CACHE, MAX_IMAGE_CACHE);
  }

  // Static assets (fonts, CSS, JS) - Cache-first
  if (
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.match(/\.(woff2?|ttf|otf|eot)$/i)
  ) {
    return cacheFirst(request, STATIC_CACHE);
  }

  // Navigation requests - Network-first
  if (request.mode === 'navigate' || request.destination === 'document') {
    return networkFirst(request, DYNAMIC_CACHE);
  }

  // API requests - Network-first with short cache
  if (url.pathname.startsWith('/api/')) {
    return networkFirst(request, DYNAMIC_CACHE, 5000); // 5 second timeout
  }

  // Everything else - Stale-while-revalidate
  return staleWhileRevalidate(request, DYNAMIC_CACHE, MAX_DYNAMIC_CACHE);
}

/**
 * Cache-first strategy
 * Returns cached version if available, otherwise fetches from network
 */
async function cacheFirst(request, cacheName, maxItems = null) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);

      // Limit cache size if maxItems is specified
      if (maxItems) {
        await limitCacheSize(cacheName, maxItems);
      }

      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.warn('[Service Worker] Fetch failed:', error);
    return new Response('Network error', { status: 408 });
  }
}

/**
 * Network-first strategy
 * Tries network first, falls back to cache if network fails
 */
async function networkFirst(request, cacheName, timeout = 3000) {
  try {
    const networkResponse = await fetchWithTimeout(request, timeout);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.warn('[Service Worker] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) return offlinePage;
    }

    return new Response('Network error and no cache available', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Stale-while-revalidate strategy
 * Returns cached version immediately, updates cache in background
 */
async function staleWhileRevalidate(request, cacheName, maxItems = null) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      caches.open(cacheName).then(async (cache) => {
        if (maxItems) {
          await limitCacheSize(cacheName, maxItems);
        }
        cache.put(request, networkResponse.clone());
      });
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

/**
 * Fetch with timeout
 */
function fetchWithTimeout(request, timeout) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
}

/**
 * Limit cache size
 */
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    // Remove oldest items (FIFO)
    const itemsToDelete = keys.length - maxItems;
    for (let i = 0; i < itemsToDelete; i++) {
      await cache.delete(keys[i]);
    }
  }
}

/**
 * Message event - Handle cache clearing and updates
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name.startsWith('prax-')) {
              return caches.delete(name);
            }
          })
        );
      })
    );
  }
});
