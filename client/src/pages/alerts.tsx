import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BellRing, Search, Filter, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Alerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(true);

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: allAlerts = [], isLoading } = useQuery({
    queryKey: ['/api/alerts', { unreadOnly: false }],
  });

  // Mark alert as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      return apiRequest(`/api/alerts/${alertId}/read`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      // Invalidate alerts queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert updated",
        description: "Alert marked as read",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark alert as read",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (alertId: number) => {
    markAsReadMutation.mutate(alertId);
  };

  // Filter alerts
  const filteredAlerts = Array.isArray(allAlerts) 
    ? allAlerts.filter((alert: any) => {
        const matchesSearch = 
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (alert.details && JSON.stringify(alert.details).toLowerCase().includes(searchTerm.toLowerCase()));
          
        const matchesType = typeFilter === "all" || alert.type === typeFilter;
        const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
        const matchesReadStatus = showUnreadOnly ? !alert.isRead : true;
        
        return matchesSearch && matchesType && matchesSeverity && matchesReadStatus;
      })
    : [];

  // Group alerts by date for better presentation
  const groupAlertsByDate = (alerts: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    alerts.forEach((alert: any) => {
      const date = new Date(alert.timestamp);
      const dateKey = date.toLocaleDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(alert);
    });
    
    return groups;
  };

  const alertGroups = groupAlertsByDate(filteredAlerts);

  // Get alert type icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'delay':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'verification':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'authentication':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'system':
        return <BellRing className="h-4 w-4 text-blue-500" />;
      default:
        return <BellRing className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format alert type to display name
  const formatAlertType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BellRing className="h-6 w-6 text-emerald-600" />
            Alerts
          </h1>
          <p className="text-gray-500">
            Notifications about your supply chain activity
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search alerts"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-4 w-4 flex-shrink-0" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="delay">Delay</SelectItem>
                  <SelectItem value="verification">Verification</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-gray-400 h-4 w-4 flex-shrink-0" />
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="unread-only"
              checked={showUnreadOnly}
              onCheckedChange={setShowUnreadOnly}
            />
            <Label htmlFor="unread-only">Show unread alerts only</Label>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <div className="space-y-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-24 animate-pulse bg-gray-200 rounded-lg"></Card>
                ))}
              </div>
            ) : filteredAlerts.length > 0 ? (
              <div className="space-y-4">
                {filteredAlerts.map((alert: any) => (
                  <Card 
                    key={alert.id}
                    className={`transition-all ${!alert.isRead ? 'border-l-4 border-l-emerald-500' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getAlertIcon(alert.type)}
                            <span className="font-medium">{formatAlertType(alert.type)} Alert</span>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            {!alert.isRead && (
                              <Badge variant="outline" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-2">{alert.message}</p>
                          
                          <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                            <span>
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                            {alert.productId && (
                              <Link href={`/products/${alert.productId}`}>
                                <a className="text-emerald-600 hover:underline">
                                  View Related Product
                                </a>
                              </Link>
                            )}
                            {alert.transactionId && (
                              <Link href={`/transactions/${alert.transactionId}`}>
                                <a className="text-emerald-600 hover:underline">
                                  View Related Transaction
                                </a>
                              </Link>
                            )}
                          </div>
                        </div>
                        
                        {!alert.isRead && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsRead(alert.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                      
                      {alert.details && (
                        <div className="mt-3 pt-3 border-t text-sm">
                          <p className="font-medium text-gray-700 mb-1">Details:</p>
                          {alert.details.timestamp && (
                            <p className="text-xs text-gray-500 mb-1">
                              Timestamp: {new Date(alert.details.timestamp).toLocaleString()}
                            </p>
                          )}
                          {alert.details.location && (
                            <p className="text-xs text-gray-500 mb-1">
                              Location: {alert.details.location.name}
                            </p>
                          )}
                          {alert.details.readings && (
                            <div className="text-xs text-gray-500 mb-1">
                              Readings: Temperature {alert.details.readings.temperature}°C 
                              (Threshold: {alert.details.readings.threshold}°C)
                            </div>
                          )}
                          {alert.details.verifiedBy && (
                            <p className="text-xs text-gray-500 mb-1">
                              Verified by: {alert.details.verifiedBy}
                            </p>
                          )}
                          {alert.details.status && (
                            <p className="text-xs text-gray-500 mb-1">
                              Status: {alert.details.status}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BellRing className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Alerts Found</h3>
                  <p className="text-gray-500">
                    {searchTerm || typeFilter !== "all" || severityFilter !== "all" 
                      ? "Try adjusting your filters"
                      : "You're all caught up! No alerts to display."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-36 animate-pulse bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : Object.keys(alertGroups).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(alertGroups)
                  .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                  .map(([date, alerts]) => (
                    <div key={date}>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
                      <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                        {alerts.map((alert: any) => (
                          <div 
                            key={alert.id} 
                            className={`relative pb-4 ${!alert.isRead ? 'font-medium' : ''}`}
                          >
                            <div className="absolute -left-[21px] mt-1.5 h-3 w-3 rounded-full bg-emerald-500"></div>
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <p className="text-sm flex items-center gap-2">
                                  {getAlertIcon(alert.type)}
                                  <span>{formatAlertType(alert.type)}</span>
                                  <Badge className={getSeverityColor(alert.severity)}>
                                    {alert.severity}
                                  </Badge>
                                  {!alert.isRead && (
                                    <Badge variant="outline" className="text-xs">New</Badge>
                                  )}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(alert.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="mt-2 sm:mt-0 flex items-center gap-2">
                                {!alert.isRead && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleMarkAsRead(alert.id)}
                                    disabled={markAsReadMutation.isPending}
                                  >
                                    Mark as Read
                                  </Button>
                                )}
                                {alert.productId && (
                                  <Link href={`/products/${alert.productId}`}>
                                    <Button size="sm" variant="ghost">
                                      View Product
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BellRing className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Alerts Found</h3>
                  <p className="text-gray-500">
                    {searchTerm || typeFilter !== "all" || severityFilter !== "all" 
                      ? "Try adjusting your filters"
                      : "You're all caught up! No alerts to display."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}