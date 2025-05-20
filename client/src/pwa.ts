/**
 * PWA utility functions and service worker registration
 */

/**
 * Register the service worker for offline functionality
 */
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed but waiting');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Service worker registration failed: ${error}`);
    }
  } else {
    console.log('Service workers are not supported in this browser');
  }
};

/**
 * Check if there are service worker updates available
 */
export const checkForUpdates = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
    } catch (error) {
      console.error(`Service worker update failed: ${error}`);
    }
  }
};

/**
 * Request permission for notifications
 * Returns true if granted, false otherwise
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error(`Notification permission request failed: ${error}`);
    return false;
  }
};

/**
 * Subscribe to push notifications (requires VAPID setup on server)
 */
export const subscribeToPushNotifications = async (): Promise<void> => {
  if (!('PushManager' in window)) {
    console.log('Push notifications are not supported in this browser');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // This would need your VAPID public key in production
      applicationServerKey: urlBase64ToUint8Array(
        'REPLACE_WITH_YOUR_PUBLIC_VAPID_KEY'
      ),
    });
    
    // This would be sent to your server to enable push notifications
    console.log('User is subscribed:', subscription);
    
    // In a real app, send the subscription to your server
    // await fetch('/api/push/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subscription),
    // });
  } catch (error) {
    console.error(`Push subscription failed: ${error}`);
  }
};

/**
 * Send a test notification (for development)
 */
export const sendTestNotification = (): void => {
  if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('Test Notification', {
        body: 'This is a test notification from Indalo Solutions',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          url: '/',
        },
        actions: [
          {
            action: 'explore',
            title: 'View Details',
            icon: '/icons/icon-96x96.png',
          },
        ],
      });
    });
  }
};

/**
 * Convert base64 string to Uint8Array for push subscription
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

/**
 * Save data in localStorage for offline use
 */
export const cacheData = async (key: string, data: any): Promise<void> => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error(`Error caching data: ${error}`);
  }
};

/**
 * Get cached data from localStorage
 * @param key The cache key
 * @param maxAge Maximum age in milliseconds (default: 1 hour)
 * @returns The cached data or null if not found or expired
 */
export const getCachedData = <T>(key: string, maxAge: number = 3600000): T | null => {
  try {
    const cachedData = localStorage.getItem(key);
    
    if (!cachedData) {
      return null;
    }
    
    const { data, timestamp } = JSON.parse(cachedData);
    const age = Date.now() - timestamp;
    
    // Return null if the cached data is too old
    if (age > maxAge) {
      // Clear the stale data
      localStorage.removeItem(key);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Error retrieving cached data: ${error}`);
    return null;
  }
};

/**
 * Clear all cached data or a specific item
 */
export const clearCache = (key?: string): void => {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      const keysToPreserve = ['theme', 'user']; // Keep user preferences
      
      // Get all keys in localStorage
      const keys = Object.keys(localStorage);
      
      // Remove items that aren't in the keysToPreserve array
      keys.forEach((k) => {
        if (!keysToPreserve.includes(k)) {
          localStorage.removeItem(k);
        }
      });
    }
  } catch (error) {
    console.error(`Error clearing cache: ${error}`);
  }
};

/**
 * Initialize PWA features
 */
export const initPWA = (): void => {
  // Register service worker
  registerServiceWorker();
  
  // Check for service worker updates once per hour
  setInterval(() => {
    checkForUpdates();
  }, 3600000);
  
  // Add online/offline event listeners
  window.addEventListener('online', () => {
    console.log('App is online');
    // Sync any stored offline data
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register('sync-scans');
      });
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('App is offline');
  });
};