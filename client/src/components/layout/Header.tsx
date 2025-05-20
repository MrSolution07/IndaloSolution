import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  User, 
  Factory, 
  Truck, 
  Store, 
  ChevronDown,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const isDashboardActive = () => {
    return location.startsWith("/dashboard");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-3">
            <img 
              src="/images/indalo-logo.jpg" 
              alt="Indalo Solutions" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="font-heading font-bold text-lg sm:text-xl text-neutral-800">Indalo Solutions</h1>
              <p className="text-xs text-secondary-dark">Track Every Link, Trust Every Step</p>
            </div>
          </a>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden text-neutral-600 hover:text-neutral-900"
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="/">
            <a className={`font-medium ${isActive('/') ? 'text-primary' : 'text-neutral-600 hover:text-primary'} transition`}>
              Home
            </a>
          </Link>
          <Link href="/products">
            <a className={`font-medium ${isActive('/products') ? 'text-primary' : 'text-neutral-600 hover:text-primary'} transition`}>
              Products
            </a>
          </Link>
          <Link href="/verification">
            <a className={`font-medium ${isActive('/verification') ? 'text-primary' : 'text-neutral-600 hover:text-primary'} transition`}>
              Verification
            </a>
          </Link>
          <Link href="/supply-chain">
            <a className={`font-medium ${isActive('/supply-chain') ? 'text-primary' : 'text-neutral-600 hover:text-primary'} transition`}>
              Supply Chain
            </a>
          </Link>

          {/* Dashboards Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center space-x-1 font-medium ${isDashboardActive() ? 'text-primary' : 'text-neutral-600 hover:text-primary'} transition`}>
              <span>Dashboards</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Role-Based Access</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard/manufacturer">
                  <a className="flex items-center">
                    <Factory className="h-4 w-4 mr-2" />
                    <span>Manufacturer</span>
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/distributor">
                  <a className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    <span>Distributor</span>
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/retailer">
                  <a className="flex items-center">
                    <Store className="h-4 w-4 mr-2" />
                    <span>Retailer</span>
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/consumer">
                  <a className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Consumer</span>
                  </a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/about">
            <a className={`font-medium ${isActive('/about') ? 'text-primary' : 'text-neutral-600 hover:text-primary'} transition`}>
              About Us
            </a>
          </Link>
          
          <Link href="/login">
            <a className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
              Sign In <User className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </nav>
      </div>
      
      {/* Mobile navigation menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
