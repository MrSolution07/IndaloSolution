import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { verifyProduct } from "@/lib/api";
import { dummyImages } from "@/lib/dummy-images";

const VerificationSection = () => {
  const [productId, setProductId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  
  const handleProductIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductId(e.target.value);
  };
  
  const handleSearch = async () => {
    if (!productId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a product ID.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await verifyProduct(productId);
      
      if (result.verified) {
        toast({
          title: "Product Verified",
          description: "This product is authentic and verified on the blockchain.",
          variant: "default",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "This product could not be verified. It may be counterfeit.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify product. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const startQRScanner = () => {
    // In a real implementation, this would initialize the QR scanner using the hook
    setIsScanning(true);
    
    // Mock QR scanner - in real app would use the useQRScanner hook
    setTimeout(() => {
      setIsScanning(false);
      const mockQRCode = "INDALO-" + Math.floor(Math.random() * 10000);
      setProductId(mockQRCode);
      
      toast({
        title: "QR Code Scanned",
        description: `Scanned product ID: ${mockQRCode}`,
      });
    }, 2000);
  };
  
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left column: Scanner UI */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md mx-auto">
              <div className="bg-primary px-6 py-4 text-white">
                <h3 className="font-heading font-semibold text-lg">Verify Your Product</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-neutral-600 mb-2">
                    Scan the QR code on your product or enter the unique product ID:
                  </p>
                  <div className="flex">
                    <input 
                      type="text" 
                      value={productId}
                      onChange={handleProductIdChange}
                      placeholder="Enter product ID..." 
                      className="flex-grow px-4 py-2 border border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button 
                      onClick={handleSearch}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md transition"
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                
                <div className="relative border-2 border-dashed border-neutral-300 rounded-lg aspect-square flex flex-col items-center justify-center bg-neutral-50 mb-4">
                  <div className="absolute inset-0 m-4 border-2 border-neutral-400/50 rounded"></div>
                  <div className="text-center z-10">
                    {isScanning ? (
                      <>
                        <div className="animate-pulse">
                          <i className="fas fa-camera text-3xl text-primary mb-2"></i>
                          <p className="text-neutral-500 font-medium">Scanning...</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-camera text-3xl text-neutral-400 mb-2"></i>
                        <p className="text-neutral-500 font-medium">Tap to scan QR code</p>
                        <p className="text-xs text-neutral-400">Position the QR code within the frame</p>
                      </>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={startQRScanner}
                  disabled={isScanning}
                  className={`w-full ${isScanning ? 'bg-neutral-400' : 'bg-primary hover:bg-primary-dark'} text-white font-medium py-3 rounded-md transition mb-2`}
                >
                  {isScanning ? (
                    <span><i className="fas fa-spinner fa-spin mr-2"></i> Scanning...</span>
                  ) : (
                    <span><i className="fas fa-qrcode mr-2"></i> Scan QR Code</span>
                  )}
                </button>
                <p className="text-xs text-center text-neutral-500">Your camera will be used only for QR code scanning</p>
              </div>
            </div>
          </div>
          
          {/* Right column: Verification explanation */}
          <div className="w-full lg:w-1/2">
            <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Instant Verification at Your Fingertips</h2>
            <p className="text-neutral-600 mb-6">
              Our blockchain verification system ensures the authenticity of every South African alcohol product in our database. In seconds, you can:
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                  <i className="fas fa-check text-sm text-primary"></i>
                </div>
                <p className="text-neutral-600">Confirm product authenticity with secure blockchain verification</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                  <i className="fas fa-check text-sm text-primary"></i>
                </div>
                <p className="text-neutral-600">View the complete supply chain journey from producer to retail</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                  <i className="fas fa-check text-sm text-primary"></i>
                </div>
                <p className="text-neutral-600">Access detailed product information, including tasting notes and ideal pairings</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                  <i className="fas fa-check text-sm text-primary"></i>
                </div>
                <p className="text-neutral-600">Report suspected counterfeit products to protect other consumers</p>
              </li>
            </ul>
            
            <div className="bg-white rounded-lg p-4 border-l-4 border-secondary shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-secondary"></i>
                </div>
                <div className="ml-3">
                  <h3 className="font-heading font-medium text-neutral-800">Works Offline</h3>
                  <p className="text-sm text-neutral-600">Our PWA caches verification data so you can check authenticity even without an internet connection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerificationSection;
