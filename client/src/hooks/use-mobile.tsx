import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current device is a mobile/small screen
 * @param breakpoint The maximum width to consider as mobile (default: 768px)
 * @returns Boolean indicating if the device is mobile-sized
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check initial viewport width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Check immediately on mount
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    // Clean up the event listener on unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;