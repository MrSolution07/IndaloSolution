import { useState, useEffect } from 'react';
import { cacheData, getCachedData } from '../pwa';

interface OfflineDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
}

/**
 * A hook that provides offline data access with caching
 * 
 * @param key The cache key for this data
 * @param fetchFn The async function to fetch the data when online
 * @param maxAge Maximum age of cached data in milliseconds before it's considered stale (default: 1 hour)
 * @returns Object with data, isLoading state, and error message
 */
export function useOfflineData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  maxAge: number = 3600000
): OfflineDataState<T> {
  const [state, setState] = useState<OfflineDataState<T>>({
    data: null,
    isLoading: true,
    error: null,
    isOffline: !navigator.onLine
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchData() {
      try {
        // Check if we're offline
        if (!navigator.onLine) {
          // Try to get data from cache
          const cachedData = getCachedData<T>(key, maxAge);
          
          if (cachedData) {
            if (isMounted) {
              setState({
                data: cachedData,
                isLoading: false,
                error: null,
                isOffline: true
              });
            }
          } else {
            if (isMounted) {
              setState({
                data: null,
                isLoading: false,
                error: 'You are offline and there is no cached data available',
                isOffline: true
              });
            }
          }
          return;
        }

        // We're online, fetch fresh data
        const data = await fetchFn();
        
        // Cache the data for offline use
        await cacheData(key, data);
        
        if (isMounted) {
          setState({
            data,
            isLoading: false,
            error: null,
            isOffline: false
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // If we're online but the fetch failed, try to get from cache
        const cachedData = getCachedData<T>(key, maxAge);
        
        if (cachedData) {
          if (isMounted) {
            setState({
              data: cachedData,
              isLoading: false,
              error: 'Using cached data due to fetch error',
              isOffline: navigator.onLine ? false : true
            });
          }
        } else {
          if (isMounted) {
            setState({
              data: null,
              isLoading: false,
              error: error instanceof Error ? error.message : 'An error occurred',
              isOffline: navigator.onLine ? false : true
            });
          }
        }
      }
    }

    // Add online/offline event listeners
    const handleOnline = () => {
      if (isMounted) {
        setState(prev => ({ ...prev, isOffline: false }));
        // Refetch when we come back online
        fetchData();
      }
    };
    
    const handleOffline = () => {
      if (isMounted) {
        setState(prev => ({ ...prev, isOffline: true }));
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial fetch
    fetchData();

    // Cleanup
    return () => {
      isMounted = false;
      controller.abort();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [key, fetchFn, maxAge]);

  return state;
}