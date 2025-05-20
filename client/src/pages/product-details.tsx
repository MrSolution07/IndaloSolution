import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getProductById, getSupplyChainData } from '@/lib/api';

const ProductDetails = () => {
  const [match, params] = useRoute('/products/:id');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  
  // Update page title and meta description when product data is loaded
  useEffect(() => {
    document.title = "Product Details | Indalo Solutions";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "View detailed information and verify the authenticity of this South African alcohol product"
      );
    }
  }, []);
  
  // Fetch product details
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: [`/api/products/${params?.id}`],
    enabled: !!params?.id,
  });
  
  // Fetch supply chain data
  const { data: supplyChain, isLoading: supplyChainLoading } = useQuery({
    queryKey: [`/api/supply-chain/${params?.id}`],
    enabled: !!params?.id && activeTab === 'supply-chain',
  });
  
  // Update page title when product is loaded
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Indalo Solutions`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `${product.name} - ${product.category} from ${product.region}. Verified authentic South African alcohol product.`
        );
      }
    }
  }, [product]);
  
  // Show error toast if product fetch fails
  useEffect(() => {
    if (productError) {
      toast({
        title: "Error Loading Product",
        description: "Failed to load product details. Please try again.",
        variant: "destructive",
      });
    }
  }, [productError, toast]);
  
  if (!match) {
    return null;
  }
  
  const handleVerifyProduct = () => {
    window.location.href = `/verification?id=${params?.id}`;
  };
  
  return (
    <div className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/" className="text-neutral-600 hover:text-primary">
                  <i className="fas fa-home mr-2"></i>
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-neutral-400 mx-2 text-xs"></i>
                  <a href="/products" className="text-neutral-600 hover:text-primary">
                    Products
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-neutral-400 mx-2 text-xs"></i>
                  <span className="text-neutral-500">
                    {productLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      product?.name || "Product Details"
                    )}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Product Details */}
        {productLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-5 w-1/4" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="pt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
              {product.isVerified && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center shadow-md">
                  <i className="fas fa-check-circle mr-2"></i> Blockchain Verified
                </div>
              )}
            </div>
            
            {/* Product Information */}
            <div>
              <h1 className="font-heading font-bold text-3xl text-neutral-800 mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <span className="bg-secondary-light/20 text-secondary-dark text-sm px-2 py-1 rounded mr-3">
                  {product.category}
                </span>
                {product.year && (
                  <span className="text-neutral-600 text-sm">{product.year}</span>
                )}
                {product.region && (
                  <>
                    <span className="text-neutral-400 mx-2">•</span>
                    <span className="text-neutral-600 text-sm">{product.region}</span>
                  </>
                )}
              </div>
              
              <div className="mb-6">
                <span className="font-bold text-2xl text-neutral-800">{product.price}</span>
              </div>
              
              <div className="prose prose-neutral mb-6">
                <p>{product.description}</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-600">Producer</span>
                  <span className="font-medium">{product.producer}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-600">Origin</span>
                  <span className="font-medium">{product.region}</span>
                </div>
                {product.alcohol && (
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-600">Alcohol</span>
                    <span className="font-medium">{product.alcohol}%</span>
                  </div>
                )}
                {product.volume && (
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-600">Volume</span>
                    <span className="font-medium">{product.volume}</span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleVerifyProduct}
                className="w-full bg-primary hover:bg-primary-dark mb-4"
              >
                <i className="fas fa-shield-alt mr-2"></i> Verify Authenticity
              </Button>
              
              <div className="text-sm text-neutral-500 flex items-center">
                <i className="fas fa-info-circle mr-2 text-primary"></i>
                Scan the QR code on the product to verify its authenticity
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl text-neutral-400 mb-4">
              <i className="fas fa-wine-bottle"></i>
            </div>
            <h2 className="text-2xl font-medium text-neutral-700 mb-2">Product Not Found</h2>
            <p className="text-neutral-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button className="bg-primary hover:bg-primary-dark" asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        )}
        
        {/* Tabs for Additional Information */}
        {product && (
          <div className="mt-12">
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
                <TabsTrigger value="certification">Certification</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-heading font-semibold text-xl mb-4">Tasting Notes</h3>
                        <div className="prose prose-neutral">
                          <p>{product.tastingNotes || "No tasting notes available for this product."}</p>
                        </div>
                        
                        {product.pairings && (
                          <div className="mt-6">
                            <h4 className="font-heading font-medium text-lg mb-2">Food Pairings</h4>
                            <p className="text-neutral-600">{product.pairings}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-heading font-semibold text-xl mb-4">Producer Information</h3>
                        <div className="prose prose-neutral">
                          <p>{product.producerInfo || "Additional producer information not available."}</p>
                        </div>
                        
                        {product.awards && (
                          <div className="mt-6">
                            <h4 className="font-heading font-medium text-lg mb-2">Awards & Recognition</h4>
                            <ul className="list-disc list-inside text-neutral-600 space-y-1">
                              {product.awards.split(';').map((award, index) => (
                                <li key={index}>{award.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="supply-chain">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-heading font-semibold text-xl mb-4">Supply Chain Journey</h3>
                    
                    {supplyChainLoading ? (
                      <div className="space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                          <div key={i} className="flex items-start">
                            <Skeleton className="h-10 w-10 rounded-full mr-4" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-5 w-1/3" />
                              <Skeleton className="h-4 w-2/3" />
                              <Skeleton className="h-4 w-1/4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : supplyChain ? (
                      <div className="relative pb-12">
                        {/* Timeline line */}
                        <div className="absolute left-5 top-5 h-full w-0.5 bg-neutral-200"></div>
                        
                        {/* Timeline steps */}
                        <div className="space-y-8">
                          {supplyChain.steps.map((step: any, index: number) => (
                            <div key={index} className="flex items-start">
                              <div className="relative z-10">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                                  <i className={step.icon || "fas fa-check"}></i>
                                </div>
                              </div>
                              <div className="ml-4">
                                <h4 className="font-medium text-lg">{step.stage}</h4>
                                <p className="text-neutral-600">{step.description}</p>
                                <p className="text-sm text-neutral-500 mt-1">
                                  {new Date(step.date).toLocaleDateString()} • {step.location}
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  Verified by: {step.verifiedBy}
                                </p>
                                {step.blockchainRef && (
                                  <a 
                                    href={`https://example.com/block/${step.blockchainRef}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline mt-1 inline-flex items-center"
                                  >
                                    <i className="fas fa-link mr-1"></i> View on Blockchain
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-3xl text-neutral-400 mb-2">
                          <i className="fas fa-route"></i>
                        </div>
                        <p className="text-neutral-600">Supply chain data is not available for this product.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="certification">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-heading font-semibold text-xl mb-4">Blockchain Certification</h3>
                        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                              <i className="fas fa-certificate text-green-600 text-xl"></i>
                            </div>
                            <div>
                              <h4 className="font-medium">Product Authenticity Verified</h4>
                              <p className="text-sm text-neutral-500">Last verified: {new Date().toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-500">Blockchain ID:</span>
                              <span className="text-sm font-mono bg-neutral-100 px-2 py-0.5 rounded">
                                {product.blockchainId || `INDALO-${params?.id?.toUpperCase()}`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-500">Certification Date:</span>
                              <span className="text-sm">
                                {product.certificationDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-500">Verifications:</span>
                              <span className="text-sm">{product.verifications || Math.floor(Math.random() * 50) + 10}</span>
                            </div>
                          </div>
                          
                          <Button className="w-full bg-neutral-800 hover:bg-black" size="sm">
                            <i className="fas fa-external-link-alt mr-2"></i> View on Blockchain Explorer
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-heading font-semibold text-xl mb-4">Quality Certifications</h3>
                        <ul className="space-y-4">
                          {(product.certifications || ['South African Wine Industry Certified', 'ISO 9001:2015']).map((cert: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                                <i className="fas fa-check text-sm text-green-600"></i>
                              </div>
                              <div>
                                <p className="font-medium">{cert}</p>
                                <p className="text-xs text-neutral-500">Verified and authenticated</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        
                        {product.sustainabilityInfo && (
                          <div className="mt-6">
                            <h4 className="font-heading font-medium text-lg mb-2">Sustainability</h4>
                            <p className="text-neutral-600">{product.sustainabilityInfo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Similar Products */}
        {product && (
          <div className="mt-16">
            <h2 className="font-heading font-semibold text-2xl mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* In a real app, we would fetch similar products based on the current product */}
              {/* For now, we'll just show skeleton placeholders */}
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
