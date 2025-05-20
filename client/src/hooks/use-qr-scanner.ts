import { useState, useCallback, useEffect } from 'react';

type QRScannerStatus = 'inactive' | 'requesting' | 'scanning' | 'error';

/**
 * Custom hook for QR code scanning functionality
 * Uses a dynamic import approach to keep bundle size small
 */
export function useQRScanner() {
  const [status, setStatus] = useState<QRScannerStatus>('inactive');
  const [error, setError] = useState<string | null>(null);
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Dynamically load the QR scanner library
  useEffect(() => {
    const loadQRScanner = async () => {
      try {
        // We're checking if it's already attached to window to avoid re-importing
        if (!window.QRScanner) {
          // In a real implementation, you would import an actual QR scanning library
          // For example: import jsQR from 'jsqr';
          // This is just a mock implementation for demo purposes
          window.QRScanner = {
            detectFromVideo: async (video: HTMLVideoElement) => {
              // In a real implementation, this would process video frames 
              // and detect QR codes. For demo purposes, we'll simulate finding
              // a code after a random delay
              await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
              
              // Simulate finding a product ID in QR format
              const productIds = [
                'HXO-1234', // Hennessy XO Cognac
                'AMA-5678', // Amarula Cream Liqueur
                'KWV-8795', // KWV 10 Year Brandy
                'MRL-3392', // Meerlust Rubicon
                'JAM-7701'  // Jameson Irish Whiskey
              ];
              
              return productIds[Math.floor(Math.random() * productIds.length)];
            }
          };
        }
      } catch (err) {
        console.error('Failed to load QR scanner:', err);
        setError('Failed to load QR scanner');
        setStatus('error');
      }
    };

    loadQRScanner();
  }, []);

  // Request camera permission
  const requestPermission = useCallback(async () => {
    setStatus('requesting');
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      
      // Clean up the stream immediately, we just wanted to check permissions
      stream.getTracks().forEach(track => track.stop());
      
      setHasPermission(true);
      setStatus('inactive');
    } catch (err: any) {
      console.error('Camera permission error:', err);
      setError(err.message || 'Failed to access camera');
      setHasPermission(false);
      setStatus('error');
    }
  }, []);

  // Start the QR scanner with a video element
  const startScanner = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!window.QRScanner) {
      setError('QR scanner not initialized');
      setStatus('error');
      return;
    }
    
    if (!hasPermission) {
      await requestPermission();
      if (!hasPermission) return;
    }
    
    setStatus('scanning');
    setError(null);
    setScannedValue(null);
    
    try {
      // Start video stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      videoElement.srcObject = stream;
      videoElement.play();
      
      // Start scanning loop
      const scanLoop = async () => {
        if (status !== 'scanning') {
          return;
        }
        
        try {
          const code = await window.QRScanner.detectFromVideo(videoElement);
          
          if (code) {
            setScannedValue(code);
            setStatus('inactive');
            
            // Stop video stream
            if (videoElement.srcObject) {
              const stream = videoElement.srcObject as MediaStream;
              stream.getTracks().forEach(track => track.stop());
              videoElement.srcObject = null;
            }
            
            return;
          }
          
          // Continue scanning if no code found
          requestAnimationFrame(scanLoop);
        } catch (err) {
          console.error('Scanning error:', err);
          setError('Error while scanning');
          setStatus('error');
          
          // Stop video stream on error
          if (videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
          }
        }
      };
      
      // Start the scanning loop
      scanLoop();
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(err.message || 'Failed to access camera');
      setStatus('error');
    }
  }, [hasPermission, requestPermission, status]);

  // Stop the scanner
  const stopScanner = useCallback(() => {
    setStatus('inactive');
  }, []);

  // Reset the scanner state
  const resetScanner = useCallback(() => {
    setStatus('inactive');
    setError(null);
    setScannedValue(null);
  }, []);

  return {
    status,
    error,
    scannedValue,
    hasPermission,
    requestPermission,
    startScanner,
    stopScanner,
    resetScanner
  };
}

// Add type definition for the QR scanner we're attaching to window
declare global {
  interface Window {
    QRScanner?: {
      detectFromVideo: (video: HTMLVideoElement) => Promise<string | null>;
    };
  }
}

export default useQRScanner;