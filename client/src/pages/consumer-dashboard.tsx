import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { QrCode, AlertTriangle, Check, CalendarIcon, BarChart3, ShieldCheck, History, FileText, Info } from "lucide-react";
import { dummyImages } from "@/lib/dummy-images";

export default function ConsumerDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
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
          <h1 className="text-3xl font-bold text-primary">Consumer Dashboard</h1>
          <p className="text-muted-foreground">Verify your purchases and view your verification history</p>
        </div>
        <div>
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

      <Tabs defaultValue="verify">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verify">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Verify Product
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Verification History
          </TabsTrigger>
          <TabsTrigger value="learn">
            <Info className="h-4 w-4 mr-2" />
            Learn About Verification
          </TabsTrigger>
        </TabsList>
        
        {/* Verification Tab */}
        <TabsContent value="verify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verify Your Purchase</CardTitle>
              <CardDescription>Scan the QR code on your product to check its authenticity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-100 rounded-md p-6 flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-300">
                {scanStatus === 'none' ? (
                  <>
                    <QrCode className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-center text-muted-foreground mb-4">Scan the QR code on your product label to verify authenticity</p>
                    <Button onClick={simulateScan}>
                      Start Camera
                    </Button>
                  </>
                ) : scanStatus === 'success' ? (
                  <div className="text-center">
                    <div className="rounded-full bg-green-100 p-4 inline-flex items-center justify-center mb-4">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-green-700 mb-2">{scanResult}</h3>
                    <p className="text-green-600 mb-4">This product has been authenticated on the blockchain</p>
                    <div className="space-y-2 text-left bg-green-50 p-4 rounded-md border border-green-100 max-w-md mx-auto">
                      <h4 className="font-medium">Product Details:</h4>
                      <p className="text-sm">Jameson Original Irish Whiskey</p>
                      <p className="text-sm">Producer: Irish Distillers</p>
                      <p className="text-sm">Bottling Date: January 12, 2025</p>
                      <p className="text-sm">Verified by: Indalo Solutions Blockchain</p>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" onClick={() => setScanStatus('none')}>
                        Scan Another
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="rounded-full bg-red-100 p-4 inline-flex items-center justify-center mb-4">
                      <AlertTriangle className="h-10 w-10 text-red-600" />
                    </div>
                    <h3 className="text-xl font-medium text-red-700 mb-2">{scanResult}</h3>
                    <p className="text-red-600 mb-4">This product could not be verified on the blockchain</p>
                    <div className="space-y-2 text-left bg-red-50 p-4 rounded-md border border-red-100 max-w-md mx-auto">
                      <h4 className="font-medium">Possible Reasons:</h4>
                      <ul className="text-sm list-disc list-inside">
                        <li>The product may be counterfeit</li>
                        <li>The QR code may be damaged</li>
                        <li>The product might be from a batch that wasn't registered</li>
                        <li>There may be a network issue</li>
                      </ul>
                      <p className="mt-2 font-medium">Recommendation:</p>
                      <p className="text-sm">Do not consume this product. Please contact the retailer where you purchased it or report this incident using the button below.</p>
                    </div>
                    <div className="mt-4 flex space-x-3 justify-center">
                      <Button variant="outline" onClick={() => setScanStatus('none')}>
                        Scan Again
                      </Button>
                      <Button variant="destructive">
                        Report Suspicious Product
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Manual Verification</h3>
                <div className="flex space-x-2">
                  <Input placeholder="Enter product code or batch number" />
                  <Button>Verify</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Verification History</CardTitle>
              <CardDescription>Products you've verified in the past</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-medium mb-2">Today</h3>
                  
                  <div className="space-y-3">
                    <div className="flex p-3 rounded-md border bg-green-50">
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Jameson Original Irish Whiskey</h4>
                          <span className="text-xs text-gray-500">14:32</span>
                        </div>
                        <p className="text-sm">Authentic product verified on blockchain</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Share Result
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <h3 className="font-medium mb-2">Yesterday</h3>
                  
                  <div className="space-y-3">
                    <div className="flex p-3 rounded-md border bg-green-50">
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Kanonkop Cabernet Sauvignon 2019</h4>
                          <span className="text-xs text-gray-500">18:15</span>
                        </div>
                        <p className="text-sm">Authentic product verified on blockchain</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Share Result
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex p-3 rounded-md border bg-red-50">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">KWV 10 Year Brandy</h4>
                          <span className="text-xs text-gray-500">12:42</span>
                        </div>
                        <p className="text-sm">Failed verification - possible counterfeit</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
                            Report Status
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Last Week</h3>
                  
                  <div className="space-y-3">
                    <div className="flex p-3 rounded-md border">
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Inverroche Classic Gin</h4>
                          <span className="text-xs text-gray-500">May 1, 2025</span>
                        </div>
                        <p className="text-sm">Authentic product verified on blockchain</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex p-3 rounded-md border">
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Hennessy VS Cognac</h4>
                          <span className="text-xs text-gray-500">April 30, 2025</span>
                        </div>
                        <p className="text-sm">Authentic product verified on blockchain</p>
                        <div className="flex space-x-3 mt-1">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Verification Statistics</CardTitle>
              <CardDescription>Your product authentication activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Total Verifications</h3>
                    <span className="text-2xl font-bold text-primary">5</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Success Rate</h3>
                    <span className="text-2xl font-bold text-primary">80%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Reports Submitted</h3>
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-red-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Learn Tab */}
        <TabsContent value="learn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How Product Verification Works</CardTitle>
              <CardDescription>Understanding blockchain authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">What is Blockchain Verification?</h3>
                    <p>Blockchain verification is a secure technology that creates an unchangeable record of a product's journey through the supply chain. Each product has a unique digital identity that can be verified to ensure authenticity.</p>
                    
                    <h3 className="text-lg font-medium">Why It Matters</h3>
                    <p>Counterfeit alcohol is a serious problem that can pose health risks and fund criminal activities. Blockchain verification helps ensure that you're purchasing and consuming authentic, safely produced products.</p>
                    
                    <div className="rounded-md border p-4 bg-amber-50">
                      <h4 className="font-medium flex items-center text-amber-800 mb-2">
                        <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                        Counterfeiting in South Africa
                      </h4>
                      <p className="text-sm text-amber-800">
                        The South African alcohol industry loses approximately R6 billion annually to illicit trade, with dangerous counterfeit products accounting for a significant portion of this figure.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <img 
                      src={dummyImages.vineyard1} 
                      alt="Blockchain Verification Process" 
                      className="w-full h-auto rounded-md mb-4"
                    />
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium mr-3">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium">Scan the Product</h4>
                          <p className="text-sm text-muted-foreground">Use your smartphone to scan the QR code on the product label.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium mr-3">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium">Blockchain Verification</h4>
                          <p className="text-sm text-muted-foreground">The app connects to the blockchain to verify the product's digital identity.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium mr-3">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium">View Results</h4>
                          <p className="text-sm text-muted-foreground">See verification results and detailed product information.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium mr-3">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium">Report Issues</h4>
                          <p className="text-sm text-muted-foreground">If verification fails, report the product to help combat counterfeiting.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">What should I do if a product fails verification?</h4>
                      <p className="text-sm text-muted-foreground">If a product fails verification, do not consume it. Return it to the retailer where it was purchased and report it through the app's reporting feature.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Can I verify products without internet connection?</h4>
                      <p className="text-sm text-muted-foreground">The app stores recent verification data for offline use. While new verifications require an internet connection, you can access your verification history offline.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">How secure is the blockchain verification system?</h4>
                      <p className="text-sm text-muted-foreground">Blockchain technology creates an immutable, tamper-proof record. Each product has a unique identifier that cannot be duplicated, providing a high level of security and trust.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Does verification guarantee product quality?</h4>
                      <p className="text-sm text-muted-foreground">Verification confirms authenticity but doesn't guarantee quality. However, authentic products from reputable producers generally maintain strict quality standards.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download Guide
              </Button>
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Verification Statistics
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}