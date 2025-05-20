import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Bell, Calendar as CalendarIcon, FileText, Truck, Package, AlertTriangle, Check, ChevronRight, ShieldCheck, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { dummyImages } from "@/lib/dummy-images";

export default function DistributorDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAlertSettings, setShowAlertSettings] = useState(false);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Distributor Dashboard</h1>
          <p className="text-muted-foreground">Manage shipments, track inventory, and verify products</p>
        </div>
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Bell className="h-5 w-5 mr-2" />
                Alerts
                <Badge variant="destructive" className="absolute -top-2 -right-2">2</Badge>
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
                      <span>Inventory Alerts</span>
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
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start p-2 rounded-md bg-amber-50">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Low Stock Warning</p>
                        <p className="text-xs text-gray-500">Jameson Whiskey inventory below threshold</p>
                        <p className="text-xs text-gray-400">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start p-2 rounded-md bg-red-50">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Temperature Threshold Exceeded</p>
                        <p className="text-xs text-gray-500">Wine shipment in warehouse B3 above 18°C</p>
                        <p className="text-xs text-gray-400">3 hours ago</p>
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

      <Tabs defaultValue="inventory">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="shipments">
            <Truck className="h-4 w-4 mr-2" />
            Shipments
          </TabsTrigger>
          <TabsTrigger value="verification">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Verification
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Products in Stock</CardTitle>
                <CardDescription>Across all warehouses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">8,432</div>
                <p className="text-sm text-green-600">↑ 12% from last month</p>
                <div className="flex items-center space-x-1 mt-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary/20 rounded-sm" 
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
                <CardTitle className="text-base">Low Stock Alerts</CardTitle>
                <CardDescription>Items needing restock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">7</div>
                <p className="text-sm text-amber-600">↑ 2 new alerts today</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div className="h-2 bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Verification Rate</CardTitle>
                <CardDescription>Blockchain verification success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">99.8%</div>
                <p className="text-sm text-green-600">↑ 0.3% from standard</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '99.8%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Current Inventory</CardTitle>
                  <CardDescription>All products across warehouses</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Search inventory..." 
                    className="w-60"
                  />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="wine">Wine</SelectItem>
                      <SelectItem value="whiskey">Whiskey</SelectItem>
                      <SelectItem value="cognac">Cognac</SelectItem>
                      <SelectItem value="brandy">Brandy</SelectItem>
                      <SelectItem value="gin">Gin</SelectItem>
                      <SelectItem value="vodka">Vodka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">Product</th>
                      <th className="text-left py-3 font-medium">Category</th>
                      <th className="text-left py-3 font-medium">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Location
                        </div>
                      </th>
                      <th className="text-left py-3 font-medium">Status</th>
                      <th className="text-right py-3 font-medium">Quantity</th>
                      <th className="text-left py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3">
                            <img src={dummyImages.bottle1} className="w-full h-full object-cover" alt="Jameson" />
                          </div>
                          <span>Jameson Original</span>
                        </div>
                      </td>
                      <td className="py-3">Whiskey</td>
                      <td className="py-3">Warehouse A2</td>
                      <td className="py-3">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Low Stock</Badge>
                      </td>
                      <td className="py-3 text-right">32 units</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3">
                            <img src={dummyImages.bottle2} className="w-full h-full object-cover" alt="KWV" />
                          </div>
                          <span>KWV 10 Year Brandy</span>
                        </div>
                      </td>
                      <td className="py-3">Brandy</td>
                      <td className="py-3">Warehouse A1</td>
                      <td className="py-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">In Stock</Badge>
                      </td>
                      <td className="py-3 text-right">187 units</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3">
                            <img src={dummyImages.bottle1} className="w-full h-full object-cover" alt="Hennessy" />
                          </div>
                          <span>Hennessy VS Cognac</span>
                        </div>
                      </td>
                      <td className="py-3">Cognac</td>
                      <td className="py-3">Warehouse B3</td>
                      <td className="py-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">In Stock</Badge>
                      </td>
                      <td className="py-3 text-right">94 units</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3">
                            <img src={dummyImages.bottle2} className="w-full h-full object-cover" alt="Amarula" />
                          </div>
                          <span>Amarula Cream Liqueur</span>
                        </div>
                      </td>
                      <td className="py-3">Liqueur</td>
                      <td className="py-3">Warehouse C1</td>
                      <td className="py-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">In Stock</Badge>
                      </td>
                      <td className="py-3 text-right">156 units</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3">
                            <img src={dummyImages.bottle1} className="w-full h-full object-cover" alt="Inverroche" />
                          </div>
                          <span>Inverroche Classic Gin</span>
                        </div>
                      </td>
                      <td className="py-3">Gin</td>
                      <td className="py-3">Warehouse B1</td>
                      <td className="py-3">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Low Stock</Badge>
                      </td>
                      <td className="py-3 text-right">28 units</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 5 of 248 products
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Shipments Tab */}
        <TabsContent value="shipments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Incoming Shipments</CardTitle>
                <CardDescription>Expected today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">4</div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span>On Time: 3</span>
                  <span>Delayed: 1</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Outgoing Shipments</CardTitle>
                <CardDescription>Scheduled today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">7</div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span>Prepared: 5</span>
                  <span>Pending: 2</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Temperature Alerts</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">1</div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span>Resolved: 0</span>
                  <span>Active: 1</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Shipments</CardTitle>
                  <CardDescription>Next 7 days</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button>
                    <Truck className="h-4 w-4 mr-2" />
                    New Shipment
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">JM-20250507-001</h4>
                      <p className="text-sm text-muted-foreground">Incoming Shipment • Today</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">In Transit</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="font-medium">Jameson Distillery</p>
                      <p className="text-sm">Cape Town</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="font-medium">Jameson Original</p>
                      <p className="text-sm">150 units</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ETA</p>
                      <p className="font-medium">May 7, 2025</p>
                      <p className="text-sm">13:45</p>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        View Details
                      </Button>
                      <Button size="sm">
                        Prepare Intake
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">KWV-20250507-003</h4>
                      <p className="text-sm text-muted-foreground">Outgoing Shipment • Today</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Ready for Pickup</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">Johannesburg Retail</p>
                      <p className="text-sm">Sandton</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="font-medium">KWV 10 Year Brandy</p>
                      <p className="text-sm">75 units</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup</p>
                      <p className="font-medium">May 7, 2025</p>
                      <p className="text-sm">16:30</p>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        View Details
                      </Button>
                      <Button size="sm">
                        Print Documents
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">HN-20250508-002</h4>
                      <p className="text-sm text-muted-foreground">Incoming Shipment • Tomorrow</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Delayed</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="font-medium">Hennessy Distributor</p>
                      <p className="text-sm">Durban</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="font-medium">Hennessy VS Cognac</p>
                      <p className="text-sm">120 units</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ETA</p>
                      <p className="font-medium">May 8, 2025 <span className="text-amber-600">(+1 day)</span></p>
                      <p className="text-sm">10:15</p>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                        Update Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 3 of 11 shipments
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Verification</CardTitle>
              <CardDescription>Authenticate products using the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-method">Verification Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qr">QR Code Scan</SelectItem>
                        <SelectItem value="batch">Batch ID</SelectItem>
                        <SelectItem value="serial">Serial Number</SelectItem>
                        <SelectItem value="blockchain">Blockchain ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-id">Product Identifier</Label>
                    <Input placeholder="Enter product ID, scan QR code, or enter batch number" />
                  </div>
                  
                  <Button className="w-full">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Verify Authenticity
                  </Button>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Recent Verifications</h3>
                    <div className="space-y-3">
                      <div className="flex p-2 rounded-md bg-green-50">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">Jameson Original #JO-8752</h4>
                            <span className="text-xs text-gray-500 ml-2">14:32</span>
                          </div>
                          <p className="text-sm">Authentic product verified on blockchain.</p>
                        </div>
                      </div>
                      
                      <div className="flex p-2 rounded-md bg-green-50">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">KWV 10 Year Brandy Batch #B-2025-045</h4>
                            <span className="text-xs text-gray-500 ml-2">12:18</span>
                          </div>
                          <p className="text-sm">75 products batch verified successfully.</p>
                        </div>
                      </div>
                      
                      <div className="flex p-2 rounded-md bg-red-50">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">Hennessy XO #HN-X-3325</h4>
                            <span className="text-xs text-gray-500 ml-2">09:45</span>
                          </div>
                          <p className="text-sm">Verification failed. Product not found in blockchain.</p>
                          <Button variant="outline" size="sm" className="mt-1 h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">
                            Report Issue
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <ShieldCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium">Blockchain Verification Guide</h3>
                    <p className="text-sm text-muted-foreground">How to authenticate products on the Indalo system</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium mr-3">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Select Verification Method</h4>
                        <p className="text-sm text-muted-foreground">Choose QR code scanning for individual products or batch verification for multiple items.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium mr-3">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Enter Product Identifier</h4>
                        <p className="text-sm text-muted-foreground">Input the unique code, scan the QR code, or enter the batch number from the product.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium mr-3">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Review Verification Results</h4>
                        <p className="text-sm text-muted-foreground">The system checks the blockchain for authenticity and displays verification results.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium mr-3">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Take Appropriate Action</h4>
                        <p className="text-sm text-muted-foreground">For verified products, proceed with distribution. For failed verifications, report suspicious products.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Documents & Certificates</CardTitle>
                  <CardDescription>Product documentation and certificates</CardDescription>
                </div>
                <div>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-medium mb-2">Shipping Documents</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-md border hover:bg-muted/30">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">Jameson Whiskey - Shipping Manifest</p>
                          <p className="text-xs text-muted-foreground">JM-20250507-001 • Added May 6, 2025</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded-md border hover:bg-muted/30">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">KWV Brandy - Delivery Note</p>
                          <p className="text-xs text-muted-foreground">KWV-20250507-003 • Added May 7, 2025</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <h3 className="font-medium mb-2">Verification Certificates</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-md border hover:bg-muted/30">
                      <div className="flex items-center">
                        <ShieldCheck className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <p className="font-medium">Jameson Original - Batch Certificate</p>
                          <p className="text-xs text-muted-foreground">Batch JW-2025-045 • Verified May 5, 2025</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded-md border hover:bg-muted/30">
                      <div className="flex items-center">
                        <ShieldCheck className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <p className="font-medium">KWV 10 Year Brandy - Authentication Certificate</p>
                          <p className="text-xs text-muted-foreground">Batch B-2025-045 • Verified May 4, 2025</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Quality Assurance Reports</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-md border hover:bg-muted/30">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-amber-500 mr-3" />
                        <div>
                          <p className="font-medium">Temperature Monitoring Report</p>
                          <p className="text-xs text-muted-foreground">Warehouse B3 • Generated May 3, 2025</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded-md border hover:bg-muted/30">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-amber-500 mr-3" />
                        <div>
                          <p className="font-medium">Storage Conditions Audit</p>
                          <p className="text-xs text-muted-foreground">All Warehouses • Generated April 29, 2025</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
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