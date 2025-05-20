// Service Worker for Indalo Solutions PWA

const CACHE_NAME = 'indalo-cache-v1';
const API_CACHE_NAME = 'indalo-api-cache-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event handler - cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate event handler - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete all caches that aren't the current ones
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated, claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event handler - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Handle API requests (cache then network strategy)
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cache the response
            let responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // If both cache and network fail, return fallback for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            
            // Otherwise return a simple error response
            return new Response('Network error occurred. Unable to fetch resource.', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Function to handle API requests with a network-first, falling back to cache strategy
async function handleApiRequest(request) {
  try {
    // Try to fetch from network first
    const response = await fetch(request);
    
    // Cache the response if successful
    if (response.status === 200) {
      const responseToCache = response.clone();
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, responseToCache);
    }
    
    return response;
  } catch (error) {
    // If network request fails, try to get from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If neither network nor cache works, look for offline data in IndexedDB
    return handleOfflineApiRequest(request);
  }
}

// Function to handle API requests when completely offline
async function handleOfflineApiRequest(request) {
  // Extract the API endpoint from the URL
  const url = new URL(request.url);
  const endpoint = url.pathname;
  
  // For verification endpoints, we'll serve cached data
  if (endpoint === '/api/verification') {
    return new Response(JSON.stringify({
      message: 'You are currently offline. Your verification request has been saved and will be processed when you reconnect.',
      offline: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // For product listings, serve a generic response
  if (endpoint === '/api/products') {
    return caches.match('/api/products');
  }
  
  // Default response for API requests when offline
  return new Response(JSON.stringify({
    error: 'You are currently offline. Please reconnect to access this feature.',
    offline: true
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Background sync for verification requests made while offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-verifications') {
    event.waitUntil(syncVerifications());
  }
});

// Function to sync saved verifications when back online
async function syncVerifications() {
  try {
    // Open the IndexedDB database
    const db = await openDatabase();
    
    // Get all saved verifications
    const tx = db.transaction('offlineVerifications', 'readonly');
    const store = tx.objectStore('offlineVerifications');
    const verifications = await store.getAll();
    
    // Process each verification
    for (const verification of verifications) {
      try {
        // Send the verification to the server
        const response = await fetch('/api/verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(verification)
        });
        
        if (response.ok) {
          // If successful, delete the verification from IndexedDB
          const deleteTx = db.transaction('offlineVerifications', 'readwrite');
          const deleteStore = deleteTx.objectStore('offlineVerifications');
          await deleteStore.delete(verification.id);
        }
      } catch (error) {
        console.error('Error syncing verification:', error);
      }
    }
    
    // Close the database
    db.close();
  } catch (error) {
    console.error('Error during verification sync:', error);
  }
}

// Helper function to open the IndexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('IndaloOfflineDB', 1);
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('offlineVerifications')) {
        db.createObjectStore('offlineVerifications', { keyPath: 'id' });
      }
    };
  });
}

// Push event handler for notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification from Indalo Solutions',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Indalo Solutions Notification',
        options
      )
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Open the URL from the notification data
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
