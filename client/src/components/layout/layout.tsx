import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import MobileHeader from "./mobile-header";
import { useMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle click outside to close mobile menu
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMobileMenuOpen && 
        isMobile && 
        !target.closest('aside') && 
        !target.closest('button')
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobile, isMobileMenuOpen]);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
