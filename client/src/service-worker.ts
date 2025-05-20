/// <reference lib="webworker" />

// Version number for cache
const CACHE_VERSION = 'v1';

// Cache name with version
const CACHE_NAME = `indalo-cache-${CACHE_VERSION}`;

// Assets to cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  '/src/main.tsx',
  '/src/index.css'
];

// API cache name
const API_CACHE_NAME = 'indalo-api-cache';

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        return (self as any).skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => {
      return (self as any).clients.claim();
    })
  );
});

// Fetch event - serve from cache and update cache from network
self.addEventListener('fetch', (event: FetchEvent) => {
  const requestUrl = new URL(event.request.url);
  
  // Handle API requests (cache then network)
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // Cache the response if it's valid
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If network request fails, try to get from cache
            return cache.match(event.request);
          });
      })
    );
    return;
  }
  
  // For non-API requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      // If both cache and network fail, return a fallback
      if (event.request.headers.get('accept')?.includes('text/html')) {
        return caches.match('/');
      }
      return new Response('Network error occurred', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

// Background sync for storing operations made offline
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-verification-data') {
    event.waitUntil(syncVerificationData());
  }
});

// Function to sync verification data
async function syncVerificationData() {
  const db = await openDB();
  const tx = db.transaction('offlineVerifications', 'readonly');
  const store = tx.objectStore('offlineVerifications');
  const offlineVerifications = await store.getAll();
  
  for (const verification of offlineVerifications) {
    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verification)
      });
      
      if (response.ok) {
        // Remove the synced item from IndexedDB
        const deleteTx = db.transaction('offlineVerifications', 'readwrite');
        const deleteStore = deleteTx.objectStore('offlineVerifications');
        await deleteStore.delete(verification.id);
      }
    } catch (error) {
      console.error('Error syncing verification data:', error);
    }
  }
}

// IndexedDB setup
function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('IndaloOfflineDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('offlineVerifications')) {
        db.createObjectStore('offlineVerifications', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export {};
