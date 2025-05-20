import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Boxes, 
  BarChart3,
  Scan, 
  BellRing, 
  History, 
  LogOut 
} from "lucide-react";

interface SidebarProps {
  isMobileMenuOpen: boolean;
}

export default function Sidebar({ isMobileMenuOpen }: SidebarProps) {
  const [location] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts', { unreadOnly: true }],
    enabled: !!user,
  });
  
  const unreadAlerts = Array.isArray(alerts) ? alerts.filter(alert => !alert.isRead).length : 0;
  
  // Navigation items based on user role
  const getNavigationByRole = () => {
    const commonItems = [
      { name: 'Dashboard', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
      { name: 'Products', href: '/products', icon: <Boxes className="w-5 h-5" /> },
      { 
        name: 'Alerts', 
        href: '/alerts', 
        icon: <BellRing className="w-5 h-5" />,
        badge: unreadAlerts > 0 ? unreadAlerts : null
      },
    ];

    // Add role-specific items
    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { name: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'Transactions', href: '/transactions', icon: <History className="w-5 h-5" /> }
      ];
    } else if (['supplier', 'manufacturer', 'distributor', 'retailer'].includes(user?.role || '')) {
      return [
        ...commonItems,
        { name: 'Transactions', href: '/transactions', icon: <History className="w-5 h-5" /> },
        { name: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> }
      ];
    } else {
      // Consumer or default user
      return [
        ...commonItems,
        { name: 'Scan Product', href: '/scan', icon: <Scan className="w-5 h-5" /> }
      ];
    }
  };

  const navigation = getNavigationByRole();
  
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen",
      isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-emerald-600 bg-clip-text text-transparent">
            AuthenticFlow
          </h1>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href || 
                (item.href !== '/' && location.startsWith(item.href));
              
              return (
                <Link key={item.name} href={item.href}>
                  <a className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md group",
                    isActive 
                      ? "bg-gradient-to-r from-emerald-700 to-emerald-600 text-white" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                  )}>
                    <span className={cn(
                      "mr-3",
                      isActive ? "text-white" : "text-emerald-600 group-hover:text-emerald-700"
                    )}>
                      {item.icon}
                    </span>
                    {item.name}
                    {item.badge && (
                      <Badge 
                        className="ml-auto bg-red-500 hover:bg-red-600" 
                        variant="destructive"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Avatar>
                <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
                <AvatarFallback className="bg-amber-100 text-amber-800">
                  {user?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-700">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs font-medium text-emerald-700 capitalize">
                {user?.role || "Guest"}
              </p>
            </div>
            <Link href="/logout">
              <a className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-500">
                <LogOut className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
