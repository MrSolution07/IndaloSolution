import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Bell, Calendar as CalendarIcon, ChevronDown, PlusCircle, BarChart3, ClipboardList, Truck, AlertTriangle, Check, X, Thermometer, Link } from "lucide-react";
import { Label } from "@/components/ui/label";
import { dummyImages } from "@/lib/dummy-images";
import { AlertsPanel } from "@/components/shared/AlertsPanel";
import { TemperatureMonitor } from "@/components/shared/TemperatureMonitor";
import { TransactionTracker } from "@/components/shared/TransactionTracker";

// We'll add a comprehensive manufacturer dashboard with multiple tabs for analytics, alerts, and data entry

export default function ManufacturerDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentTab, setCurrentTab] = useState("analytics");
  const [showAlertSettings, setShowAlertSettings] = useState(false);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manufacturer Dashboard</h1>
          <p className="text-muted-foreground">Manage your production, view analytics, and monitor alerts</p>
        </div>
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Bell className="h-5 w-5 mr-2" />
                Alerts
                <Badge variant="destructive" className="absolute -top-2 -right-2">3</Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Alert Notifications</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowAlertSettings(!showAlertSettings)}>
                    {showAlertSettings ? 'Hide Settings' : 'Settings'}
                  </Button>
                </div>
                
                {showAlertSettings ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Temperature Alerts</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shipment Delays</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Authentication Events</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Push Notifications</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start p-2 rounded-md bg-red-50">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Temperature Alert</p>
                        <p className="text-xs text-gray-500">Amarula shipment stored above 10°C for 2+ hours</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start p-2 rounded-md bg-amber-50">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Shipment Delay</p>
                        <p className="text-xs text-gray-500">Jameson delivery to Cape Town delayed by 24 hours</p>
                        <p className="text-xs text-gray-400">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start p-2 rounded-md bg-blue-50">
                      <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Verification Success</p>
                        <p className="text-xs text-gray-500">53 successful verifications of Savanna Cider today</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {date ? format(date, "PP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="analytics" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="data-entry">
            <ClipboardList className="h-4 w-4 mr-2" />
            Data Entry
          </TabsTrigger>
          <TabsTrigger value="shipments">
            <Truck className="h-4 w-4 mr-2" />
            Shipments
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerts Log
          </TabsTrigger>
        </TabsList>
        
        {/* Analytics Dashboard Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Counterfeit Reduction Rate</CardTitle>
                <CardDescription>Compared to previous year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">87%</div>
                <p className="text-sm text-green-600">↑ 23% from last year</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '87%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Verification Rate</CardTitle>
                <CardDescription>Products scanned this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">23,487</div>
                <p className="text-sm text-green-600">↑ 12% from last month</p>
                <div className="flex items-center space-x-1 mt-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 h-8 bg-primary/20 rounded-sm" 
                      style={{ 
                        height: `${(Math.random() * 24) + 8}px`,
                        opacity: i > 8 ? 1 : 0.7
                      }}
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Delivery Time</CardTitle>
                <CardDescription>From production to retail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">4.2 days</div>
                <p className="text-sm text-green-600">↓ 0.8 days from target</p>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-xs ml-2">70%</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Verified Products</CardTitle>
                <CardDescription>Most authenticated products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                      <img src={dummyImages.bottle1} alt="Jameson" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Jameson Original</h4>
                        <span className="text-sm text-green-600">4,532 scans</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                      <img src={dummyImages.bottle2} alt="Savanna" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Savanna Dry Cider</h4>
                        <span className="text-sm text-green-600">3,871 scans</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                      <img src={dummyImages.bottle1} alt="Amarula" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Amarula Cream Liqueur</h4>
                        <span className="text-sm text-green-600">2,945 scans</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '71%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Verification Status</CardTitle>
                <CardDescription>Success rate by verification type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">QR Code Scans</span>
                      <span className="text-sm font-medium">98.2%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '98.2%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Batch Validations</span>
                      <span className="text-sm font-medium">95.7%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '95.7%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Supply Chain Integrity</span>
                      <span className="text-sm font-medium">92.3%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '92.3%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Temperature Compliance</span>
                      <span className="text-sm font-medium">87.9%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '87.9%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Data Entry Form Tab */}
        <TabsContent value="data-entry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Data Entry</CardTitle>
              <CardDescription>Record new product events in the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-type">Product</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jameson">Jameson Original</SelectItem>
                        <SelectItem value="savanna">Savanna Dry Cider</SelectItem>
                        <SelectItem value="amarula">Amarula Cream Liqueur</SelectItem>
                        <SelectItem value="kwv-brandy">KWV 10 Year Brandy</SelectItem>
                        <SelectItem value="inverroche">Inverroche Classic Gin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="harvest">Raw Material Harvest/Sourcing</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="aging">Aging/Fermentation</SelectItem>
                        <SelectItem value="bottling">Bottling</SelectItem>
                        <SelectItem value="distribution">Distribution</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stellenbosch">Stellenbosch</SelectItem>
                        <SelectItem value="paarl">Paarl</SelectItem>
                        <SelectItem value="franschhoek">Franschhoek</SelectItem>
                        <SelectItem value="cape-town">Cape Town</SelectItem>
                        <SelectItem value="johannesburg">Johannesburg</SelectItem>
                        <SelectItem value="durban">Durban</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter details about this event..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input type="number" id="temperature" placeholder="e.g. 18" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <Input type="number" id="humidity" placeholder="e.g. 65" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch Number</Label>
                    <Input type="text" id="batch" placeholder="e.g. BATCH-1234" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Record Event on Blockchain
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Shipments Tab */}
        <TabsContent value="shipments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>Currently in transit shipments with live tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Jameson Whiskey - Batch JW-2025-045</h4>
                      <p className="text-sm text-muted-foreground">Cape Town → Johannesburg</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">In Transit</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs">Cape Town</span>
                        <span className="text-xs">68% Complete</span>
                        <span className="text-xs">Johannesburg</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                      <span>Departed: May 5, 2025 • 09:15</span>
                      <span>ETA: May 8, 2025 • 14:30</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs">
                        <span className="font-medium">Temp:</span> 18°C
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Humidity:</span> 54%
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Blockchain Verfied:</span> Yes
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Amarula Cream - Batch AM-2025-098</h4>
                      <p className="text-sm text-muted-foreground">Paarl → Durban</p>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Alert</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs">Paarl</span>
                        <span className="text-xs">34% Complete</span>
                        <span className="text-xs">Durban</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '34%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                      <span>Departed: May 6, 2025 • 11:30</span>
                      <span>ETA: May 10, 2025 • 08:45</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs">
                        <span className="font-medium">Temp:</span> 11°C
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-1"></span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Humidity:</span> 68%
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Blockchain Verfied:</span> Yes
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Alert className="text-xs bg-red-50 p-2 rounded-md">
                      <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                      Temperature exceeds recommended maximum of 10°C for this product
                    </Alert>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Savanna Dry Cider - Batch SD-2025-176</h4>
                      <p className="text-sm text-muted-foreground">Stellenbosch → Port Elizabeth</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Delayed</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs">Stellenbosch</span>
                        <span className="text-xs">52% Complete</span>
                        <span className="text-xs">Port Elizabeth</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '52%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                      <span>Departed: May 4, 2025 • 08:00</span>
                      <span>ETA: May 9, 2025 • 16:15 <span className="text-yellow-600">(+24h)</span></span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs">
                        <span className="font-medium">Temp:</span> 9°C
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Humidity:</span> 62%
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Blockchain Verfied:</span> Yes
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1"></span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Alert className="text-xs bg-yellow-50 p-2 rounded-md">
                      <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1" />
                      Shipment delayed due to road construction on N2 highway
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Alerts Log Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2" />
                  Temperature Monitoring
                </CardTitle>
                <CardDescription>Real-time temperature tracking for products</CardDescription>
              </CardHeader>
              <CardContent>
                <TemperatureMonitor />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  Blockchain Transactions
                </CardTitle>
                <CardDescription>Recent verification and supply chain events</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <TransactionTracker limit={5} showTitle={false} compact={true} />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Alert History</CardTitle>
                <CardDescription>Recent alerts and notifications</CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter alerts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="shipment">Shipment</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-medium mb-2">May 7, 2025</h3>
                  
                  <div className="space-y-3">
                    <div className="flex p-2 rounded-md bg-red-50">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Temperature Alert</h4>
                          <span className="text-xs text-gray-500 ml-2">10:25 AM</span>
                        </div>
                        <p className="text-sm">Amarula shipment batch AM-2025-098 recorded temperature of 11°C, exceeding maximum recommended temperature of 10°C for over 2 hours.</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
                            Escalate
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex p-2 rounded-md bg-yellow-50">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Shipping Delay</h4>
                          <span className="text-xs text-gray-500 ml-2">08:47 AM</span>
                        </div>
                        <p className="text-sm">Savanna Dry Cider batch SD-2025-176 shipment to Port Elizabeth delayed by approximately 24 hours due to road construction on N2 highway.</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Mark as Handled
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <h3 className="font-medium mb-2">May 6, 2025</h3>
                  
                  <div className="space-y-3">
                    <div className="flex p-2 rounded-md bg-green-50">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Authenticity Verification Peak</h4>
                          <span className="text-xs text-gray-500 ml-2">2:15 PM</span>
                        </div>
                        <p className="text-sm">Unusual spike in authentication requests for Jameson Original. 132 verifications in Cape Town area within 3 hours - all legitimate.</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex p-2 rounded-md bg-red-50">
                      <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Authentication Failure</h4>
                          <span className="text-xs text-gray-500 ml-2">11:38 AM</span>
                          <Badge variant="outline" className="text-xs ml-2 bg-red-50 text-red-700">Critical</Badge>
                        </div>
                        <p className="text-sm">Multiple failed authentication attempts (17) for KWV 10 Year Brandy in Johannesburg. Possible counterfeit product in circulation.</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
                            Report to Authorities
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">May 5, 2025</h3>
                  
                  <div className="space-y-3">
                    <div className="flex p-2 rounded-md bg-amber-50">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Low Inventory Alert</h4>
                          <span className="text-xs text-gray-500 ml-2">4:05 PM</span>
                        </div>
                        <p className="text-sm">Inverroche Classic Gin inventory at Johannesburg distribution center is below threshold (15 cases remaining).</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Schedule Restock
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Mark as Handled
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex p-2 rounded-md bg-blue-50">
                      <Check className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Successful Batch Registration</h4>
                          <span className="text-xs text-gray-500 ml-2">9:22 AM</span>
                        </div>
                        <p className="text-sm">New Amarula batch AM-2025-098 successfully registered on blockchain with 5,000 units.</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Certificate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

function Alert({ children, className }: AlertProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {children}
    </div>
  );
}