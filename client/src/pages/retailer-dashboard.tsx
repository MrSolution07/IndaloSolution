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
import { Bell, Calendar as CalendarIcon, FileText, ShoppingCart, QrCode, AlertTriangle, Check, ChevronRight, ShieldCheck, Truck, BarChart3 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { dummyImages } from "@/lib/dummy-images";

export default function RetailerDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<'success' | 'failure' | 'none'>('none');

  const simulateScan = () => {
    // Simulate QR code scanning (in a real app this would use the camera)
    const results = ['success', 'failure'];
    const randomResult = results[Math.floor(Math.random() * results.length)] as 'success' | 'failure';
    
    setScanStatus('none'); // Reset first
    
    setTimeout(() => {
      setScanStatus(randomResult);
      if (randomResult === 'success') {
        setScanResult('Jameson Original - Authentic Product');
      } else {
        setScanResult('WARNING: Authentication Failed - Possible Counterfeit');
      }
    }, 1500);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Retailer Dashboard</h1>
          <p className="text-muted-foreground">Verify products, manage inventory, and track sales</p>
        </div>
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Bell className="h-5 w-5 mr-2" />
                Alerts
                <Badge variant="destructive" className="absolute -top-2 -right-2">1</Badge>
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
                      <span>Inventory Alerts</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Authentication Alerts</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sales Alerts</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delivery Alerts</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Push Notifications</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start p-2 rounded-md bg-red-50">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Authentication Failure</p>
                        <p className="text-xs text-gray-500">Possible counterfeit KWV Brandy detected</p>
                        <p className="text-xs text-gray-400">28 minutes ago</p>
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

      <Tabs defaultValue="verification">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="verification">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Verification
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="deliveries">
            <Truck className="h-4 w-4 mr-2" />
            Deliveries
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Verification</CardTitle>
                <CardDescription>Scan products to verify authenticity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-100 rounded-md p-6 flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300">
                  {scanStatus === 'none' ? (
                    <>
                      <QrCode className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-center text-muted-foreground mb-4">Scan QR code on product to verify authenticity</p>
                      <Button onClick={simulateScan}>
                        Start Scanner
                      </Button>
                    </>
                  ) : scanStatus === 'success' ? (
                    <div className="text-center">
                      <div className="rounded-full bg-green-100 p-4 inline-flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-medium text-green-700 mb-2">{scanResult}</h3>
                      <p className="text-green-600 mb-4">Product verified on blockchain</p>
                      <Button variant="outline" onClick={() => setScanStatus('none')}>
                        Scan Another
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="rounded-full bg-red-100 p-4 inline-flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-medium text-red-700 mb-2">{scanResult}</h3>
                      <p className="text-red-600 mb-4">Could not verify product on blockchain</p>
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={() => setScanStatus('none')}>
                          Scan Again
                        </Button>
                        <Button variant="destructive">
                          Report Product
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Manual Verification</h3>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter product code or scan barcode" />
                    <Button>Verify</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Recent Verifications</h3>
                  <div className="space-y-3">
                    <div className="flex p-2 rounded-md bg-green-50">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <h4 className="font-medium">Jameson Original</h4>
                        <p className="text-xs text-gray-500">Verified at 13:45</p>
                      </div>
                    </div>
                    <div className="flex p-2 rounded-md bg-green-50">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <h4 className="font-medium">Inverroche Gin</h4>
                        <p className="text-xs text-gray-500">Verified at 11:28</p>
                      </div>
                    </div>
                    <div className="flex p-2 rounded-md bg-red-50">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <h4 className="font-medium">KWV 10 Year Brandy</h4>
                        <p className="text-xs text-gray-500">Failed verification at 10:15</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Verification Guide</CardTitle>
                <CardDescription>How to properly authenticate products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <QrCode className="h-5 w-5 mr-2 text-primary" />
                      QR Code Verification
                    </h3>
                    <ol className="space-y-2 pl-6 list-decimal">
                      <li>Click "Start Scanner" to activate the camera</li>
                      <li>Point the camera at the QR code on the product</li>
                      <li>Wait for the verification process to complete</li>
                      <li>Check the verification result on screen</li>
                    </ol>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-2">What to Do If Verification Fails</h3>
                    <ul className="space-y-2 pl-6 list-disc">
                      <li>Try scanning the product again to eliminate scanning errors</li>
                      <li>Check if the QR code or barcode is damaged or obscured</li>
                      <li>Verify the product details manually using the serial number</li>
                      <li>If authentication fails repeatedly, report the product for further investigation</li>
                      <li>Do not sell products that fail verification</li>
                    </ul>
                  </div>
                  
                  <div className="rounded-md border p-4 bg-amber-50">
                    <h3 className="font-medium mb-2 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                      Important Notes
                    </h3>
                    <p className="text-sm mb-2">All premium alcohol products must be verified before being displayed on shelves. Failed verifications may indicate counterfeit products and should be reported immediately.</p>
                    <p className="text-sm">If you need assistance with the verification process, please contact technical support at support@indalosolutions.co.za.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Stock</CardTitle>
                <CardDescription>Current inventory value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">R985,450</div>
                <p className="text-sm text-green-600">↑ 8% from last month</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '78%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Low Stock Items</CardTitle>
                <CardDescription>Products needing reorder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">12</div>
                <p className="text-sm text-amber-600">4 critical, 8 warning</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-amber-500 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Selling Category</CardTitle>
                <CardDescription>Past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">Whiskey</div>
                <p className="text-sm text-green-600">↑ 15% from previous month</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '65%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Store Inventory</CardTitle>
                  <CardDescription>Current stock levels and product details</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Input placeholder="Search products..." className="w-64" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="wine">Wine</SelectItem>
                      <SelectItem value="whiskey">Whiskey</SelectItem>
                      <SelectItem value="cognac">Cognac</SelectItem>
                      <SelectItem value="brandy">Brandy</SelectItem>
                      <SelectItem value="gin">Gin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
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
                      <th className="text-left py-3 font-medium">Price</th>
                      <th className="text-center py-3 font-medium">Authentication</th>
                      <th className="text-right py-3 font-medium">Stock Level</th>
                      <th className="text-center py-3 font-medium">Status</th>
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
                      <td className="py-3">R385.00</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Verified</Badge>
                      </td>
                      <td className="py-3 text-right">28 units</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">In Stock</Badge>
                      </td>
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
                            <img src={dummyImages.bottle2} className="w-full h-full object-cover" alt="Hennessy" />
                          </div>
                          <span>Hennessy VS Cognac</span>
                        </div>
                      </td>
                      <td className="py-3">Cognac</td>
                      <td className="py-3">R565.00</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Verified</Badge>
                      </td>
                      <td className="py-3 text-right">14 units</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Low Stock</Badge>
                      </td>
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
                            <img src={dummyImages.bottle1} className="w-full h-full object-cover" alt="KWV" />
                          </div>
                          <span>KWV 10 Year Brandy</span>
                        </div>
                      </td>
                      <td className="py-3">Brandy</td>
                      <td className="py-3">R425.00</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Failed</Badge>
                      </td>
                      <td className="py-3 text-right">6 units</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Quarantined</Badge>
                      </td>
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
                            <img src={dummyImages.bottle2} className="w-full h-full object-cover" alt="Inverroche" />
                          </div>
                          <span>Inverroche Classic Gin</span>
                        </div>
                      </td>
                      <td className="py-3">Gin</td>
                      <td className="py-3">R395.00</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Verified</Badge>
                      </td>
                      <td className="py-3 text-right">32 units</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">In Stock</Badge>
                      </td>
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
                            <img src={dummyImages.bottle1} className="w-full h-full object-cover" alt="Kanonkop" />
                          </div>
                          <span>Kanonkop Cabernet Sauvignon 2019</span>
                        </div>
                      </td>
                      <td className="py-3">Wine</td>
                      <td className="py-3">R485.00</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Verified</Badge>
                      </td>
                      <td className="py-3 text-right">18 units</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Low Stock</Badge>
                      </td>
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
                Showing 5 of 184 products
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Deliveries Tab */}
        <TabsContent value="deliveries" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Deliveries</CardTitle>
                  <CardDescription>Expected shipments and arrivals</CardDescription>
                </div>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Jameson Shipment (JM-20250507-001)</h4>
                      <p className="text-sm text-muted-foreground">Expected: Today, May 7, 2025</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">In Transit</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="font-medium">Jameson Original (150 units)</p>
                      <p className="text-sm">Verification: Pre-authenticated</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p className="font-medium">Cape Town Distribution</p>
                      <p className="text-sm">Contact: 021-555-8765</p>
                    </div>
                    <div className="md:text-right">
                      <Button size="sm" variant="outline" className="mb-2 w-full md:w-auto">
                        Track Shipment
                      </Button>
                      <Button size="sm" className="w-full md:w-auto">
                        Prepare Intake
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Mixed Spirits Delivery (MS-20250508-003)</h4>
                      <p className="text-sm text-muted-foreground">Expected: May 8, 2025</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Confirmed</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="font-medium">Various Spirits (5 products)</p>
                      <p className="text-sm">Verification: Required on arrival</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p className="font-medium">Johannesburg Wholesale</p>
                      <p className="text-sm">Contact: 011-222-3344</p>
                    </div>
                    <div className="md:text-right">
                      <Button size="sm" variant="outline" className="mb-2 w-full md:w-auto">
                        View Manifest
                      </Button>
                      <Button size="sm" className="w-full md:w-auto">
                        Prepare Intake
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Premium Wine Collection (WN-20250510-007)</h4>
                      <p className="text-sm text-muted-foreground">Expected: May 10, 2025</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Pending Confirmation</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="font-medium">Premium South African Wines</p>
                      <p className="text-sm">Verification: Required on arrival</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p className="font-medium">Cape Winelands Direct</p>
                      <p className="text-sm">Contact: 021-444-5566</p>
                    </div>
                    <div className="md:text-right">
                      <Button size="sm" variant="outline" className="mb-2 w-full md:w-auto">
                        Confirm Order
                      </Button>
                      <Button size="sm" disabled className="w-full md:w-auto">
                        Prepare Intake
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
              <CardDescription>Recent shipments received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">Reference</th>
                      <th className="text-left py-3 font-medium">Date</th>
                      <th className="text-left py-3 font-medium">Supplier</th>
                      <th className="text-left py-3 font-medium">Products</th>
                      <th className="text-center py-3 font-medium">Verification</th>
                      <th className="text-left py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3">IN-20250505-002</td>
                      <td className="py-3">May 5, 2025</td>
                      <td className="py-3">Premium Spirits Ltd</td>
                      <td className="py-3">Multiple (8 items)</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">All Verified</Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3">IN-20250503-005</td>
                      <td className="py-3">May 3, 2025</td>
                      <td className="py-3">Cape Town Distribution</td>
                      <td className="py-3">Whiskey Assortment</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">1 Issue</Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3">IN-20250429-001</td>
                      <td className="py-3">April 29, 2025</td>
                      <td className="py-3">Stellenbosch Vineyards</td>
                      <td className="py-3">Premium Wines</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">All Verified</Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sales This Month</CardTitle>
                <CardDescription>Total retail value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">R645,280</div>
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
                <CardTitle className="text-base">Verification Success Rate</CardTitle>
                <CardDescription>Blockchain authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">99.7%</div>
                <p className="text-sm text-amber-600">↓ 0.2% from target</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '99.7%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Customer Verifications</CardTitle>
                <CardDescription>Customer-initiated scans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">385</div>
                <p className="text-sm text-green-600">↑ 42% from last month</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Highest revenue items this month</CardDescription>
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
                        <span className="text-sm text-green-600">R85,750</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>223 units sold</span>
                        <span>100% verified</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-primary rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                      <img src={dummyImages.bottle2} alt="Hennessy" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Hennessy VS Cognac</h4>
                        <span className="text-sm text-green-600">R67,800</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>120 units sold</span>
                        <span>100% verified</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-primary rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                      <img src={dummyImages.bottle1} alt="Inverroche" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Inverroche Classic Gin</h4>
                        <span className="text-sm text-green-600">R51,350</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>130 units sold</span>
                        <span>100% verified</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-primary rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                      <img src={dummyImages.bottle2} alt="Kanonkop" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Kanonkop Cabernet Sauvignon</h4>
                        <span className="text-sm text-green-600">R43,650</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>90 units sold</span>
                        <span>100% verified</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-primary rounded-full" style={{ width: '58%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Verification Statistics</CardTitle>
                <CardDescription>Authentication trends and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Staff Verifications</span>
                      <span className="text-sm font-medium">2,456</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Customer Verifications</span>
                      <span className="text-sm font-medium">385</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Verification Success Rate</span>
                      <span className="text-sm font-medium">99.7%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '99.7%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Failed Verifications</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Products Quarantined</span>
                      <span className="text-sm font-medium">6</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-amber-500 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-3 mt-4 bg-amber-50">
                    <h4 className="font-medium mb-1 flex items-center text-amber-800">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                      Verification Alert
                    </h4>
                    <p className="text-xs text-amber-800">
                      A batch of KWV 10 Year Brandy (6 units) failed verification on May 6. These units have been quarantined for further investigation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}