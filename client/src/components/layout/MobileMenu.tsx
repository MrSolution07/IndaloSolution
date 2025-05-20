import { Link, useLocation } from "wouter";
import { 
  User, 
  Factory, 
  Truck, 
  Store,
  Home,
  Package,
  ShieldCheck,
  LinkIcon,
  InfoIcon
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const isDashboardActive = (path: string) => {
    return location.startsWith(path);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="lg:hidden bg-white border-t">
      <div className="container mx-auto px-4 py-3 space-y-2">
        <Link href="/">
          <a 
            className={`flex items-center py-2 px-4 font-medium ${isActive('/') ? 'text-primary' : 'text-neutral-600'} hover:bg-neutral-100 rounded-md`}
            onClick={onClose}
          >
            <Home className="h-5 w-5 mr-3" />
            Home
          </a>
        </Link>
        <Link href="/products">
          <a 
            className={`flex items-center py-2 px-4 font-medium ${isActive('/products') ? 'text-primary' : 'text-neutral-600'} hover:bg-neutral-100 rounded-md`}
            onClick={onClose}
          >
            <Package className="h-5 w-5 mr-3" />
            Products
          </a>
        </Link>
        <Link href="/verification">
          <a 
            className={`flex items-center py-2 px-4 font-medium ${isActive('/verification') ? 'text-primary' : 'text-neutral-600'} hover:bg-neutral-100 rounded-md`}
            onClick={onClose}
          >
            <ShieldCheck className="h-5 w-5 mr-3" />
            Verification
          </a>
        </Link>
        <Link href="/supply-chain">
          <a 
            className={`flex items-center py-2 px-4 font-medium ${isActive('/supply-chain') ? 'text-primary' : 'text-neutral-600'} hover:bg-neutral-100 rounded-md`}
            onClick={onClose}
          >
            <LinkIcon className="h-5 w-5 mr-3" />
            Supply Chain
          </a>
        </Link>
        <Link href="/about">
          <a 
            className={`flex items-center py-2 px-4 font-medium ${isActive('/about') ? 'text-primary' : 'text-neutral-600'} hover:bg-neutral-100 rounded-md`}
            onClick={onClose}
          >
            <InfoIcon className="h-5 w-5 mr-3" />
            About Us
          </a>
        </Link>
        
        {/* Dashboards Section */}
        <div className="pt-2 border-t mt-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-neutral-500">DASHBOARDS</h3>
          
          <Link href="/dashboard/manufacturer">
            <a 
              className={`flex items-center py-2 px-4 font-medium ${isDashboardActive('/dashboard/manufacturer') ? 'text-primary' : 'text-neutral-600'} hover:bg-neutral-100 rounded-md`}
              onClick={onClose}
            >
              <Factory className="h-5 w-5 mr-3" />
              Manufacturer
            </a>
          </Link>
          
          <Link href="/dashboard/distributor">
            <a 
              className={`flex items-center py-2 px-4 font-medium ${isDashboardActive('/dashboard/distributor') ? 'text-primary' : 'text-neutral-600'} hover:bg-neutral-100 rounded-md`}
              onClick={onClose}
            >
              <Truck className="h-5 w-5 mr-3" />
              Distributor
            </a>
          </Link>
          
          <Link href="/dashboard/retailer">
            <a 
              className={`flex items-center py-2 px-4 font-medium ${isDashboardActive('/dashboard/retailer') ? 'text-primary' : 'text-neutral-600'} hover:bg-neutral-100 rounded-md`}
              onClick={onClose}
            >
              <Store className="h-5 w-5 mr-3" />
              Retailer
            </a>
          </Link>
          
          <Link href="/dashboard/consumer">
            <a 
              className={`flex items-center py-2 px-4 font-medium ${isDashboardActive('/dashboard/consumer') ? 'text-primary' : 'text-neutral-600'} hover:bg-neutral-100 rounded-md`}
              onClick={onClose}
            >
              <User className="h-5 w-5 mr-3" />
              Consumer
            </a>
          </Link>
        </div>
        
        <div className="pt-2 border-t mt-2">
          <Link href="/login">
            <a 
              className="flex items-center py-2 px-4 font-medium text-white bg-primary hover:bg-primary/80 rounded-md"
              onClick={onClose}
            >
              <User className="h-5 w-5 mr-3" />
              Sign In
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
