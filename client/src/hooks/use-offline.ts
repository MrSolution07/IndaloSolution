import { useState, useEffect } from 'react';

/**
 * Custom hook to detect and monitor network connectivity status
 * @returns Object containing online status and functions to interact with offline data
 */
export function useOffline() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [hasOfflineData, setHasOfflineData] = useState<boolean>(false);

  useEffect(() => {
    // Event listeners for online and offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for offline data in IndexedDB
    const checkOfflineData = async () => {
      try {
        if ('indexedDB' in window) {
          // Open the database
          const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open('indalo-offline-db', 1);
            request.onerror = () => reject(new Error('Failed to open IndexedDB'));
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
              const db = (event.target as IDBOpenDBRequest).result;
              // Create object stores if they don't exist
              if (!db.objectStoreNames.contains('verifications')) {
                db.createObjectStore('verifications', { keyPath: 'id', autoIncrement: true });
              }
              if (!db.objectStoreNames.contains('products')) {
                db.createObjectStore('products', { keyPath: 'id' });
              }
            };
          });

          // Check if we have any pending verifications to sync
          const transaction = db.transaction(['verifications'], 'readonly');
          const store = transaction.objectStore('verifications');
          const countRequest = store.count();

          countRequest.onsuccess = () => {
            setHasOfflineData(countRequest.result > 0);
          };

          // Close the database connection
          db.close();
        }
      } catch (error) {
        console.error('Error checking offline data:', error);
      }
    };

    // Check for offline data on mount and when coming back online
    checkOfflineData();

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Saves verification data to IndexedDB for offline use
   */
  const saveVerificationOffline = async (verificationData: any) => {
    if (!('indexedDB' in window)) {
      console.error('IndexedDB not supported');
      return;
    }

    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('indalo-offline-db', 1);
        request.onerror = () => reject(new Error('Failed to open IndexedDB'));
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('verifications')) {
            db.createObjectStore('verifications', { keyPath: 'id', autoIncrement: true });
          }
        };
      });

      const transaction = db.transaction(['verifications'], 'readwrite');
      const store = transaction.objectStore('verifications');
      
      // Add the data with current timestamp
      const data = {
        ...verificationData,
        timestamp: new Date().toISOString(),
        synced: false
      };
      
      const request = store.add(data);
      
      request.onsuccess = () => {
        setHasOfflineData(true);
        console.log('Verification saved offline');
      };
      
      request.onerror = () => {
        console.error('Error saving verification offline');
      };
      
      // Close the database connection
      db.close();
      
      return true;
    } catch (error) {
      console.error('Error saving verification offline:', error);
      return false;
    }
  };

  /**
   * Syncs all offline verifications when back online
   */
  const syncOfflineData = async () => {
    if (!isOnline) {
      console.log('Cannot sync offline data while offline');
      return;
    }

    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('indalo-offline-db', 1);
        request.onerror = () => reject(new Error('Failed to open IndexedDB'));
        request.onsuccess = () => resolve(request.result);
      });

      const transaction = db.transaction(['verifications'], 'readwrite');
      const store = transaction.objectStore('verifications');
      
      // Get all unsynced verifications
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = async () => {
        const unsyncedVerifications = getAllRequest.result.filter(v => !v.synced);
        
        if (unsyncedVerifications.length === 0) {
          console.log('No offline data to sync');
          setHasOfflineData(false);
          return;
        }
        
        // Attempt to sync each verification with the server
        for (const verification of unsyncedVerifications) {
          try {
            // Make API call to sync
            const response = await fetch('/api/verification', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(verification),
            });
            
            if (response.ok) {
              // Mark as synced in the database
              const updateTransaction = db.transaction(['verifications'], 'readwrite');
              const updateStore = updateTransaction.objectStore('verifications');
              verification.synced = true;
              await updateStore.put(verification);
              console.log(`Synced verification ${verification.id}`);
            } else {
              console.error(`Failed to sync verification ${verification.id}`);
            }
          } catch (error) {
            console.error(`Error syncing verification ${verification.id}:`, error);
          }
        }
        
        // Check if we have any remaining unsynced data
        const checkTransaction = db.transaction(['verifications'], 'readonly');
        const checkStore = checkTransaction.objectStore('verifications');
        const checkRequest = checkStore.getAll();
        
        checkRequest.onsuccess = () => {
          const remainingUnsynced = checkRequest.result.filter(v => !v.synced);
          setHasOfflineData(remainingUnsynced.length > 0);
        };
      };
      
      // Close the database connection
      db.close();
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  };

  // Automatically try to sync when we come online
  useEffect(() => {
    if (isOnline && hasOfflineData) {
      syncOfflineData();
    }
  }, [isOnline, hasOfflineData]);

  return {
    isOnline,
    hasOfflineData,
    saveVerificationOffline,
    syncOfflineData
  };
}

export default useOffline;