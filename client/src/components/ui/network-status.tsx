import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  
  useEffect(() => {
    // Update network status when it changes
    const handleOnline = () => {
      setIsOnline(true);
      // Show status temporarily
      setShowStatus(true);
      // Hide after 3 seconds
      setTimeout(() => setShowStatus(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      // Show status when offline (will remain visible)
      setShowStatus(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Only show when status changes or when offline
  if (!showStatus) {
    return null;
  }
  
  return (
    <div className={`fixed bottom-4 left-4 flex items-center gap-2 py-2 px-3 rounded-full shadow-md z-50 transition-all duration-300 ${
      isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span className="text-sm font-medium">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Offline</span>
        </>
      )}
    </div>
  );
}

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!isOffline) {
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 w-full bg-amber-500 text-white py-1 px-4 text-center text-sm font-medium z-50">
      You are currently offline. Some features may be limited.
    </div>
  );
}