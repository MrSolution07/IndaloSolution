import { Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Integration } from "@shared/schema";
import { cn } from "@/lib/utils";

interface IntegrationCardProps {
  integration?: Integration;
  isAddNew?: boolean;
  small?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

export default function IntegrationCard({ 
  integration, 
  isAddNew = false, 
  small = false,
  onClick,
  onDelete,
  onToggleStatus
}: IntegrationCardProps) {
  if (isAddNew) {
    return (
      <Card 
        className={cn(
          "flex flex-col items-center justify-center border-dashed hover:border-gray-400 transition-colors cursor-pointer",
          small ? "p-4" : "p-6"
        )}
        onClick={onClick}
      >
        <div className={cn(
          "rounded-lg bg-gray-100 flex items-center justify-center mb-2",
          small ? "w-12 h-12" : "w-16 h-16"
        )}>
          <i className="ri-add-line text-gray-600 text-2xl"></i>
        </div>
        <span className={cn(
          "font-medium text-gray-900",
          small ? "text-sm" : "text-base mt-2"
        )}>
          Add {small ? "More" : "Integration"}
        </span>
      </Card>
    );
  }
  
  if (!integration) return null;
  
  return (
    <Card className={cn(
      "border transition-shadow hover:shadow-md",
      small ? "flex flex-col items-center justify-center p-4" : "p-5"
    )}>
      {small ? (
        // Small card version for dashboard
        <>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-2",
            integration.active ? "bg-blue-100" : "bg-gray-100"
          )}>
            <i className={`${integration.icon} text-2xl ${integration.active ? "text-blue-600" : "text-gray-600"}`}></i>
          </div>
          <span className="text-sm font-medium text-gray-900">{integration.name}</span>
        </>
      ) : (
        // Full card version for integrations page
        <>
          <div className="flex items-center mb-4">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              integration.active ? "bg-blue-100" : "bg-gray-100"
            )}>
              <i className={`${integration.icon} text-2xl ${integration.active ? "text-blue-600" : "text-gray-600"}`}></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            {integration.active 
              ? "Connected and ready to use in your workflows." 
              : "Currently disconnected. Toggle to activate."}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch 
                checked={integration.active} 
                onCheckedChange={onToggleStatus}
                id={`toggle-${integration.id}`}
              />
              <label 
                htmlFor={`toggle-${integration.id}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {integration.active ? "Active" : "Inactive"}
              </label>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete}
              className="text-gray-500 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
