import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertTriangle, Camera, QrCode, Search, Send, ArrowLeft, Tag, Clock, MapPin, WifiOff } from "lucide-react";
import { cacheData, getCachedData } from "@/pwa";

export default function ScanProduct() {
  const { qrCode } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [manualQrCode, setManualQrCode] = useState(qrCode || "");
  const [scanActive, setScanActive] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  
  // Check if the browser supports getUserMedia (for camera access)
  const [hasCamera, setHasCamera] = useState(false);
  
  useEffect(() => {
    // Check if camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setHasCamera(true);
    }
    
    // If QR code is provided in the URL, trigger verification
    if (qrCode) {
      verifyQrCode(qrCode);
    }
  }, [qrCode]);
  
  const { data: verificationResult, isLoading: isVerifying } = useQuery({
    queryKey: [`/api/verify/${qrCode}`],
    enabled: !!qrCode,
  });
  
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Effect to monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const verifyMutation = useMutation({
    mutationFn: async (qrCodeToVerify: string) => {
      // Check if we're offline - try to get from cache first
      if (!navigator.onLine) {
        const cachedResult = getCachedData<any>(`verify_${qrCodeToVerify}`);
        if (cachedResult) {
          return Promise.resolve(cachedResult);
        }
        
        return Promise.reject(new Error("You are offline and this product hasn't been scanned before"));
      }
      
      // Online verification
      const result = await apiRequest(`/api/verify/${qrCodeToVerify}`);
      
      // Cache the result for offline use
      if (result) {
        cacheData(`verify_${qrCodeToVerify}`, result);
      }
      
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: data.authenticated ? "Authentication Successful" : "Authentication Failed",
        description: data.authenticated 
          ? (isOffline 
              ? "This product was previously verified on the blockchain (offline data)" 
              : "This product has been verified on the blockchain")
          : "This product could not be authenticated",
        variant: data.authenticated ? "default" : "destructive",
      });
      
      // Update URL without reloading
      setLocation(`/scan/${manualQrCode}`);
    },
    onError: (error: any) => {
      toast({
        title: "Verification Error",
        description: error.message || "There was a problem verifying this product",
        variant: "destructive",
      });
    },
  });
  
  const verifyQrCode = (code: string) => {
    if (!code.trim()) {
      toast({
        title: "No QR Code",
        description: "Please enter a valid QR code or scan a product",
        variant: "destructive",
      });
      return;
    }
    
    verifyMutation.mutate(code.trim());
  };
  
  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyQrCode(manualQrCode);
  };
  
  // Simulated camera scanning functionality
  // In a real app, this would use a QR code scanning library
  const startScan = () => {
    setScanActive(true);
    
    // Simulate scanning process
    const timer = setTimeout(() => {
      // Use a sample QR code for demo purposes
      const demoQrCode = "RW23001QR"; // This matches our seed data
      setScanResult(demoQrCode);
      setManualQrCode(demoQrCode);
      setScanActive(false);
      
      // Verify the scanned code
      verifyQrCode(demoQrCode);
    }, 2000);
    
    return () => clearTimeout(timer);
  };
  
  const ProductDetails = ({ product }: { product: any }) => {
    if (!product) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <CardDescription>{product.category}</CardDescription>
            </div>
            <Badge 
              className={
                product.status === 'verified' ? 'bg-green-100 text-green-800' :
                product.status === 'flagged' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }
            >
              {product.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="w-full h-40 bg-center bg-cover rounded-md mb-4" 
            style={{ 
              backgroundImage: `url(${product.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'})` 
            }}
          />
          
          <p className="text-gray-700 mb-4">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex gap-2 items-center">
              <div className="p-1.5 bg-gray-100 rounded-full text-gray-600">
                <Tag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Batch Number</p>
                <p className="text-sm font-medium">{product.batchNumber}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="p-1.5 bg-gray-100 rounded-full text-gray-600">
                <QrCode className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Product Code</p>
                <p className="text-sm font-medium">{product.productCode}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="p-1.5 bg-gray-100 rounded-full text-gray-600">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Manufacturing Date</p>
                <p className="text-sm font-medium">
                  {new Date(product.manufacturingDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="p-1.5 bg-gray-100 rounded-full text-gray-600">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Location</p>
                <p className="text-sm font-medium">
                  {product.location?.name || "Unknown"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-full text-blue-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Blockchain Verified</p>
              <p className="text-xs text-blue-700">
                Authenticated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Link href={`/products/${product.id}`}>
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                View Full Product Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="p-4 border-b bg-white">
        <div className="max-w-lg mx-auto">
          <Link href="/">
            <a className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </a>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify Product Authenticity</h1>
              <p className="text-gray-500">Scan a QR code or enter the code manually to verify a product</p>
            </div>
            {isOffline && (
              <div className="p-2 bg-amber-100 rounded-md flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-amber-600" />
                <span className="text-xs text-amber-800 font-medium">Offline Mode</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 flex items-start justify-center">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>Authenticate Product</CardTitle>
              <CardDescription>
                Verify that your product is authentic and track its journey through the supply chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={hasCamera ? "camera" : "manual"}>
                <TabsList className="w-full">
                  {hasCamera && (
                    <TabsTrigger value="camera" className="flex-1">
                      <Camera className="h-4 w-4 mr-2" />
                      Scan QR Code
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="manual" className="flex-1">
                    <QrCode className="h-4 w-4 mr-2" />
                    Enter Code Manually
                  </TabsTrigger>
                </TabsList>
                
                {hasCamera && (
                  <TabsContent value="camera" className="mt-4">
                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative">
                      <div className="aspect-video flex items-center justify-center">
                        {scanActive ? (
                          <div className="text-center">
                            <div className="inline-block p-3 rounded-full bg-emerald-100 mb-3">
                              <Camera className="h-8 w-8 text-emerald-600 animate-pulse" />
                            </div>
                            <p className="text-gray-600">Scanning...</p>
                          </div>
                        ) : scanResult ? (
                          <div className="text-center">
                            <div className="inline-block p-3 rounded-full bg-emerald-100 mb-3">
                              <ShieldCheck className="h-8 w-8 text-emerald-600" />
                            </div>
                            <p className="text-gray-600">Code detected: {scanResult}</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="inline-block p-3 rounded-full bg-gray-200 mb-3">
                              <Camera className="h-8 w-8 text-gray-500" />
                            </div>
                            <p className="text-gray-500">Camera preview will appear here</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 border-t bg-white">
                        <Button 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 mb-3"
                          onClick={startScan}
                          disabled={scanActive || isVerifying}
                        >
                          {scanActive ? "Scanning..." : "Start Camera Scan"}
                        </Button>
                        <p className="text-xs text-gray-500 text-center">
                          Position the QR code within the camera view
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                )}
                
                <TabsContent value="manual" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="qrCode">QR Code or Product Code</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="qrCode"
                          placeholder="Enter the code from your product"
                          value={manualQrCode}
                          onChange={(e) => setManualQrCode(e.target.value)}
                        />
                        <Button 
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
                          onClick={handleManualVerify}
                          disabled={isVerifying || !manualQrCode.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Enter the QR code or product code printed on your product's label
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Verification Status */}
              {isVerifying && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                  <div className="inline-block animate-spin p-2 rounded-full">
                    <QrCode className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="mt-2 font-medium">Verifying product authenticity...</p>
                  <p className="text-sm text-gray-500">
                    Checking blockchain records
                  </p>
                </div>
              )}
              
              {verificationResult && !isVerifying && (
                <div className="mt-6 p-4 rounded-lg text-center">
                  {verificationResult.authenticated ? (
                    <div className="flex flex-col items-center">
                      <div className="inline-block p-3 rounded-full bg-green-100 mb-3">
                        <ShieldCheck className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-green-800">Authentic Product</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        This product has been verified on the blockchain
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="inline-block p-3 rounded-full bg-red-100 mb-3">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-red-800">Authentication Failed</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {verificationResult.message || "This product could not be authenticated"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Product details if authenticated */}
          {verificationResult?.authenticated && (
            <ProductDetails product={verificationResult.product} />
          )}
        </div>
      </div>
    </div>
  );
}