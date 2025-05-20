import { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Filter,
  Check,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Alert, AlertCategory, AlertPriority, useAlerts, getAlertIcon, getAlertStyle, getAlertTextColor } from '@/hooks/use-alerts';
import { format } from 'date-fns';

export const AlertsPanel = () => {
  const { alerts, unreadCount, markAsRead, markAsResolved, dismissAlert, clearAlerts } = useAlerts();
  const [showSettings, setShowSettings] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<AlertCategory[]>([
    'temperature', 'shipment', 'authentication', 'inventory', 'system'
  ]);
  const [selectedPriorities, setSelectedPriorities] = useState<AlertPriority[]>([
    'low', 'medium', 'high', 'critical'
  ]);

  // Filter alerts based on selected categories and priorities
  const filteredAlerts = alerts
    .filter(alert => selectedCategories.includes(alert.category))
    .filter(alert => selectedPriorities.includes(alert.priority))
    .filter(alert => showAll ? true : !alert.resolved);

  // Return the display name for alert categories
  const getCategoryDisplayName = (category: AlertCategory) => {
    switch (category) {
      case 'temperature': return 'Temperature';
      case 'shipment': return 'Shipment';
      case 'authentication': return 'Authentication';
      case 'inventory': return 'Inventory';
      case 'system': return 'System';
      default: return 'Unknown';
    }
  };

  // Handle category selection toggle
  const handleCategoryToggle = (category: AlertCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Handle priority selection toggle
  const handlePriorityToggle = (priority: AlertPriority) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  // Get the formatted relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1.5 -right-1.5 min-h-[1.25rem] min-w-[1.25rem] flex items-center justify-center px-[0.3rem] py-[0.1rem]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[220px]">
                <DropdownMenuLabel>Filter Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Categories
                  </DropdownMenuLabel>
                  {(['temperature', 'shipment', 'authentication', 'inventory', 'system'] as AlertCategory[]).map(category => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    >
                      <div className="flex items-center">
                        {getAlertIcon(category, 'h-4 w-4 mr-2')}
                        {getCategoryDisplayName(category)}
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Priority
                  </DropdownMenuLabel>
                  {(['low', 'medium', 'high', 'critical'] as AlertPriority[]).map(priority => (
                    <DropdownMenuCheckboxItem
                      key={priority}
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => handlePriorityToggle(priority)}
                    >
                      <span className={`capitalize ${getAlertTextColor(priority)}`}>{priority}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuCheckboxItem
                    checked={showAll}
                    onCheckedChange={() => setShowAll(!showAll)}
                  >
                    Show resolved alerts
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearAlerts}
              disabled={alerts.length === 0}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showSettings ? (
          <div className="p-4 space-y-4">
            <h4 className="font-medium mb-3">Notification Settings</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="temperature-alerts">Temperature Alerts</Label>
                  <p className="text-xs text-muted-foreground">Monitor temperature conditions</p>
                </div>
                <Switch id="temperature-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shipment-alerts">Shipment Alerts</Label>
                  <p className="text-xs text-muted-foreground">Delays and delivery notifications</p>
                </div>
                <Switch id="shipment-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auth-alerts">Authentication Alerts</Label>
                  <p className="text-xs text-muted-foreground">Verification failures and successes</p>
                </div>
                <Switch id="auth-alerts" defaultChecked />
              </div>
            </div>
            
            <Button className="w-full mt-4" onClick={() => setShowSettings(false)}>
              Save Settings
            </Button>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto py-1">
            {filteredAlerts.length > 0 ? (
              <div className="divide-y">
                {filteredAlerts.map((alert) => (
                  <AlertItem 
                    key={alert.id} 
                    alert={alert} 
                    onMarkRead={markAsRead}
                    onResolve={markAsResolved}
                    onDismiss={dismissAlert}
                    getRelativeTime={getRelativeTime}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No notifications to display</p>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

interface AlertItemProps {
  alert: Alert;
  onMarkRead: (id: string) => void;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
  getRelativeTime: (date: Date) => string;
}

const AlertItem = ({ alert, onMarkRead, onResolve, onDismiss, getRelativeTime }: AlertItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!alert.read) {
      onMarkRead(alert.id);
    }
  };

  return (
    <div 
      className={`p-3 transition-colors ${!alert.read ? 'bg-slate-50' : ''} ${alert.resolved ? 'opacity-70' : ''}`}
    >
      <div className="flex">
        <div className={`flex-shrink-0 rounded-full p-1.5 ${getAlertTextColor(alert.priority)} ${getAlertStyle(alert.priority)} mr-3`}>
          {getAlertIcon(alert.category, 'h-4 w-4')}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <p className="font-medium text-sm truncate">{alert.title}</p>
              <p className="text-xs text-muted-foreground">{getRelativeTime(alert.timestamp)}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleExpanded}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          
          <p className={`text-sm mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}>{alert.message}</p>
          
          {isExpanded && alert.metadata && (
            <div className="mt-2 p-2 bg-slate-50 rounded text-xs space-y-1">
              {Object.entries(alert.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium capitalize">{key}:</span>
                  <span>{value.toString()}</span>
                </div>
              ))}
            </div>
          )}
          
          {isExpanded && (
            <div className="flex justify-end space-x-2 mt-2">
              {!alert.resolved && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onResolve(alert.id)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Resolve
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 text-xs"
                onClick={() => onDismiss(alert.id)}
              >
                <X className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;