// Service Worker for Indalo Solutions PWA

const CACHE_NAME = 'indalo-cache-v1';
const OFFLINE_PAGE = '/offline.html';

// Assets to cache immediately during installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/badge-72x72.png'
];

// Install event - precaches key assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker', event);
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .catch((error) => {
        console.log('[Service Worker] Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker', event);
  
  // Claim clients so the SW is in control immediately
  event.waitUntil(self.clients.claim());
  
  // Remove old caches
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  return self.clients.claim();
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip non-GET requests and browser extension requests
  if (request.method !== 'GET' || 
      request.url.startsWith('chrome-extension') || 
      request.url.includes('extension') ||
      // Skip requests to the API for non-verification endpoints
      (request.url.includes('/api/') && !request.url.includes('/api/verify'))) {
    return;
  }
  
  // Network-first strategy for API verification requests
  if (request.url.includes('/api/verify')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response to store in cache
          const clonedResponse = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, clonedResponse);
            });
          
          return response;
        })
        .catch(() => {
          // If offline, try to get from cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If there's no cached response for this specific API call,
              // return a custom offline response
              return new Response(
                JSON.stringify({
                  authenticated: false,
                  message: "You're offline and this product has not been previously verified"
                }),
                {
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }
  
  // Cache-first strategy for all other requests (assets, pages)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise try to fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache responses that aren't successful
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response to store in cache and return
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.log('[Service Worker] Fetch failed:', error);
            
            // If we're trying to navigate to a page, show the offline page
            if (request.mode === 'navigate') {
              return caches.match(OFFLINE_PAGE);
            }
            
            // For other assets, just fail
            return new Response('Not available while offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Push notification event listener
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push message received:', event);
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      url: data.url || '/'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Indalo Solutions', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event);
  
  event.notification.close();
  
  // Check if clients exist and focus
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then((clientList) => {
        const url = event.notification.data.url || '/';
        
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event);
  
  if (event.tag === 'sync-scans') {
    event.waitUntil(syncScans());
  }
});

// Function to sync offline scans when back online
async function syncScans() {
  try {
    // Get all stored offline scans from IndexedDB
    const offlineScans = await getOfflineScans();
    
    // Process each offline scan
    for (const scan of offlineScans) {
      try {
        // Try to send to server
        const response = await fetch('/api/scans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(scan)
        });
        
        if (response.ok) {
          // Remove from offline storage after successful sync
          await removeOfflineScan(scan.id);
        }
      } catch (err) {
        console.error('Failed to sync scan:', err);
        // Failed to sync this scan, will try again later
      }
    }
    
    // Notify user
    if (offlineScans.length > 0) {
      self.registration.showNotification('Indalo Solutions', {
        body: `Synced ${offlineScans.length} offline scan(s)`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png'
      });
    }
  } catch (err) {
    console.error('Sync operation failed:', err);
  }
}

// Placeholder functions for IndexedDB operations
// In a real implementation, these would interact with IndexedDB
async function getOfflineScans() {
  // This would retrieve offline scans from IndexedDB
  return [];
}

async function removeOfflineScan(id) {
  // This would remove a synced scan from IndexedDB
  console.log('Removed offline scan:', id);
}