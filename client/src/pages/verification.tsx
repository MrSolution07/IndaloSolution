import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { verifyProduct, saveVerificationToIndexedDB } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { useOffline } from '@/hooks/use-offline';
import { dummyImages } from '@/lib/dummy-images';

const Verification = () => {
  const [productId, setProductId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isOffline = useOffline();
  const { toast } = useToast();
  
  // Update page title and meta description
  useEffect(() => {
    document.title = "Product Verification | Indalo Solutions";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Verify the authenticity of South African alcohol products using our blockchain-based verification system"
      );
    }
  }, []);
  
  // Cleanup function for camera
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  const handleProductIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductId(e.target.value);
  };
  
  const handleManualVerification = async () => {
    if (!productId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a product ID.",
        variant: "destructive",
      });
      return;
    }
    
    await verifyProductById(productId);
  };
  
  const verifyProductById = async (id: string) => {
    setIsLoading(true);
    
    try {
      // If offline, store verification request for later and show mock result
      if (isOffline) {
        await saveVerificationToIndexedDB({ productId: id, timestamp: new Date().toISOString() });
        
        // Show mock result for offline mode
        setVerificationResult({
          verified: true,
          product: {
            id,
            name: "Sample Product (Offline Mode)",
            category: "Wine",
            producer: "Indalo Vineyards",
            origin: "Stellenbosch, South Africa",
            verificationDate: new Date().toISOString(),
            supplyChainSteps: [
              { stage: "Production", date: "2023-01-15", location: "Stellenbosch" },
              { stage: "Bottling", date: "2023-02-10", location: "Paarl" },
              { stage: "Distribution", date: "2023-03-05", location: "Cape Town" }
            ]
          }
        });
        
        toast({
          title: "Offline Verification",
          description: "Your verification request has been saved and will be processed when you're back online.",
        });
      } else {
        // Online verification
        const result = await verifyProduct(id);
        setVerificationResult(result);
        
        if (result.verified) {
          toast({
            title: "Product Verified",
            description: "This product is authentic and verified on the blockchain.",
          });
        } else {
          toast({
            title: "Verification Failed",
            description: "This product could not be verified. It may be counterfeit.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const startQRScanner = async () => {
    setIsScanning(true);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported by your browser");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // In a real app, we would use a QR code library to detect codes
        // For this simulation, we'll pretend to scan after 3 seconds
        setTimeout(() => {
          stopQRScanner();
          const mockQRCode = "INDALO-" + Math.floor(Math.random() * 10000);
          setProductId(mockQRCode);
          verifyProductById(mockQRCode);
        }, 3000);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: error instanceof Error ? error.message : "Failed to access camera",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };
  
  const stopQRScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };
  
  return (
    <div className="py-12 bg-neutral-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Product Verification</h1>
          <p className="text-neutral-600 mb-8">
            Verify the authenticity of South African alcohol products using our blockchain-based verification system.
          </p>
          
          {isOffline && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <i className="fas fa-wifi-slash text-amber-500 mr-2"></i>
              <AlertTitle>You're offline</AlertTitle>
              <AlertDescription>
                Verification requests will be saved and processed when you're back online.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Tabs defaultValue="scanner" className="w-full">
                <TabsList className="mb-4 grid grid-cols-2">
                  <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>
                
                <TabsContent value="scanner">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scan QR Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative border-2 border-dashed border-neutral-300 rounded-lg aspect-square flex flex-col items-center justify-center bg-neutral-50 mb-4 overflow-hidden">
                        {isScanning ? (
                          <video 
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 m-4 border-2 border-neutral-400/50 rounded"></div>
                            <div className="text-center z-10">
                              <i className="fas fa-camera text-3xl text-neutral-400 mb-2"></i>
                              <p className="text-neutral-500 font-medium">Tap button below to scan QR code</p>
                              <p className="text-xs text-neutral-400">Position the QR code within the frame</p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <Button 
                        className={`w-full ${isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'}`}
                        onClick={isScanning ? stopQRScanner : startQRScanner}
                        disabled={isLoading}
                      >
                        {isScanning ? (
                          <span><i className="fas fa-stop-circle mr-2"></i> Stop Scanning</span>
                        ) : (
                          <span><i className="fas fa-qrcode mr-2"></i> Start Scanner</span>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="manual">
                  <Card>
                    <CardHeader>
                      <CardTitle>Enter Product ID</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <label htmlFor="productId" className="block text-sm font-medium text-neutral-700 mb-2">
                          Product ID
                        </label>
                        <div className="flex">
                          <Input
                            id="productId"
                            value={productId}
                            onChange={handleProductIdChange}
                            placeholder="Enter the product ID (e.g., INDALO-1234)"
                            className="flex-grow rounded-r-none"
                          />
                          <Button 
                            onClick={handleManualVerification}
                            className="bg-primary hover:bg-primary-dark rounded-l-none"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-search"></i>
                            )}
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-neutral-500">
                          You can find the product ID on the label or packaging of the product.
                        </p>
                      </div>
                      
                      <Button
                        className="w-full bg-primary hover:bg-primary-dark"
                        onClick={handleManualVerification}
                        disabled={!productId.trim() || isLoading}
                      >
                        {isLoading ? (
                          <span><i className="fas fa-spinner fa-spin mr-2"></i> Verifying...</span>
                        ) : (
                          <span><i className="fas fa-shield-alt mr-2"></i> Verify Product</span>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              {verificationResult ? (
                <Card>
                  <CardHeader className={`${verificationResult.verified ? 'bg-green-50' : 'bg-red-50'} border-b`}>
                    <CardTitle className="flex items-center">
                      {verificationResult.verified ? (
                        <>
                          <i className="fas fa-check-circle text-green-500 mr-2"></i>
                          <span>Product Verified</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times-circle text-red-500 mr-2"></i>
                          <span>Verification Failed</span>
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {verificationResult.verified ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-heading font-semibold text-lg">{verificationResult.product.name}</h3>
                            <p className="text-sm text-neutral-500">{verificationResult.product.category}</p>
                          </div>
                          <div className="bg-secondary-light/20 text-secondary-dark text-xs px-2 py-1 rounded">
                            Authentic
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Producer:</span>
                            <span className="font-medium">{verificationResult.product.producer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Origin:</span>
                            <span className="font-medium">{verificationResult.product.origin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Verified On:</span>
                            <span className="font-medium">
                              {new Date(verificationResult.product.verificationDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Supply Chain Timeline</h4>
                          <ul className="space-y-2">
                            {verificationResult.product.supplyChainSteps.map((step: any, index: number) => (
                              <li key={index} className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{step.stage}</p>
                                  <p className="text-xs text-neutral-500">
                                    {new Date(step.date).toLocaleDateString()} • {step.location}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button className="w-full bg-primary hover:bg-primary-dark mt-4">
                          <i className="fas fa-info-circle mr-2"></i> View Full Details
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-4xl text-red-500 mb-4">
                          <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3 className="text-xl font-medium text-neutral-800 mb-2">Product Not Verified</h3>
                        <p className="text-neutral-600 mb-4">
                          This product could not be verified in our blockchain database. It may be counterfeit or the ID may be incorrect.
                        </p>
                        <Button className="bg-red-600 hover:bg-red-700 text-white">
                          <i className="fas fa-flag mr-2"></i> Report Suspicious Product
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg border border-neutral-200">
                  <img 
                    src={dummyImages.qrScan2} 
                    alt="Scan QR code" 
                    className="w-32 h-32 object-cover rounded mb-6 opacity-50"
                  />
                  <h3 className="font-heading font-semibold text-xl mb-2">Product Verification</h3>
                  <p className="text-neutral-600 mb-4">
                    Scan the QR code on your product or enter the product ID to verify its authenticity.
                  </p>
                  <div className="text-xs text-neutral-500 max-w-sm">
                    Our blockchain technology guarantees the authenticity of South African alcohol products throughout the supply chain.
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="font-heading font-semibold text-2xl mb-4">How Verification Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-qrcode text-primary text-xl"></i>
                </div>
                <h3 className="font-heading font-medium text-lg mb-2">Scan or Enter ID</h3>
                <p className="text-neutral-600">
                  Use your device's camera to scan the QR code on the product or manually enter the unique product ID.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-secondary-light/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-link text-secondary text-xl"></i>
                </div>
                <h3 className="font-heading font-medium text-lg mb-2">Blockchain Verification</h3>
                <p className="text-neutral-600">
                  Our system checks the blockchain to verify the product's origin, journey, and authenticity.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-accent-light/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-shield-alt text-accent text-xl"></i>
                </div>
                <h3 className="font-heading font-medium text-lg mb-2">Get Results</h3>
                <p className="text-neutral-600">
                  Instantly receive verification results with detailed product information and supply chain data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
