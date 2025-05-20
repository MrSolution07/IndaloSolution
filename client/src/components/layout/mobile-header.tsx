import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

interface MobileHeaderProps {
  onOpenMenu: () => void;
}

export default function MobileHeader({ onOpenMenu }: MobileHeaderProps) {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });
  
  return (
    <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between h-16 bg-white border-b border-gray-200">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onOpenMenu}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </Button>
      <div className="px-4">
        <h1 className="text-xl font-bold text-primary font-heading">CreativeFlow</h1>
      </div>
      <div className="pr-2">
        <Avatar>
          <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
          <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
