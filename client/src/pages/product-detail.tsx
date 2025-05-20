import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Tag, 
  QrCode,
  Clock, 
  Truck, 
  BarChart4 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = parseInt(id || "0");
  
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: [`/api/products/${productId}/transactions`],
    enabled: !!productId,
  });
  
  const { data: scans, isLoading: isLoadingScans } = useQuery({
    queryKey: [`/api/products/${productId}/scans`],
    enabled: !!productId,
  });
  
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  if (isLoadingProduct) {
    return (
      <div className="p-6">
        <div className="h-96 animate-pulse bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Product Not Found</h3>
            <p className="text-gray-500 mb-6">
              The product you're looking for might have been removed or doesn't exist.
            </p>
            <Link href="/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper for status color badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'produced':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-amber-100 text-amber-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'sold':
        return 'bg-emerald-100 text-emerald-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate blockchain link (hypothetical for demo)
  const blockchainExplorerUrl = `https://hyperledger-explorer.example.com/tx/${product.blockchainHash}`;

  // Info box component
  const InfoBox = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: LucideIcon }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="p-2 bg-emerald-100 rounded-full text-emerald-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/products">
            <a className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(product.status)}>
              {product.status.replace('_', ' ')}
            </Badge>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">
              Added on {new Date(product.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link href={`/scan/${product.qrCode}`}>
            <Button className="bg-amber-500 hover:bg-amber-600 gap-2">
              <QrCode className="h-4 w-4" />
              Verify
            </Button>
          </Link>
          <Link href={`/transactions/new?productId=${product.id}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Truck className="h-4 w-4" />
              New Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product image and details */}
        <Card className="lg:col-span-2">
          <div 
            className="w-full h-64 bg-center bg-cover" 
            style={{ 
              backgroundImage: `url(${product.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'})` 
            }}
          />
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <InfoBox 
                title="Batch Number" 
                value={product.batchNumber} 
                icon={Tag} 
              />
              <InfoBox 
                title="Product Code" 
                value={product.productCode} 
                icon={QrCode}
              />
              <InfoBox 
                title="Category" 
                value={product.category} 
                icon={BarChart4}
              />
              <InfoBox 
                title="Manufacturing Date" 
                value={new Date(product.manufacturingDate).toLocaleDateString()} 
                icon={Calendar}
              />
            </div>
            
            <h3 className="font-medium mb-2">Blockchain Verification</h3>
            <div className="p-3 bg-blue-50 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Blockchain Verified</p>
                  <p className="text-xs text-blue-600 truncate max-w-xs">{product.blockchainHash}</p>
                </div>
              </div>
              <a 
                href={blockchainExplorerUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View on Chain
              </a>
            </div>
          </CardContent>
        </Card>
        
        {/* Current location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Location</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {product.location ? (
              <div>
                <div className="relative h-48 bg-emerald-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-emerald-600" />
                  </div>
                  {/* In a real app, this would be a map component */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white p-3 bg-opacity-90">
                    <p className="font-medium text-sm">{product.location.name}</p>
                    <p className="text-xs text-gray-500">
                      Lat: {product.location.latitude.toFixed(4)}, 
                      Long: {product.location.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-1">Product Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="p-2 bg-blue-100 rounded-full text-blue-700 h-fit">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Manufacturing Date</p>
                        <p className="text-sm font-medium">
                          {new Date(product.manufacturingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {product.expiryDate && (
                      <div className="flex gap-3">
                        <div className="p-2 bg-amber-100 rounded-full text-amber-700 h-fit">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Expiry Date</p>
                          <p className="text-sm font-medium">
                            {new Date(product.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No location data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions and Scans */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">
            Transactions History
          </TabsTrigger>
          <TabsTrigger value="scans">
            Authentication Scans
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blockchain Transactions</CardTitle>
              <CardDescription>
                Complete history of this product's journey through the supply chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 animate-pulse bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction: any) => (
                    <div key={transaction.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium capitalize">
                          {transaction.type.replace('_', ' ')} Transaction
                        </h3>
                        <Badge variant={transaction.verificationStatus ? "default" : "destructive"}>
                          {transaction.verificationStatus ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        From: User #{transaction.fromUserId} • To: User #{transaction.toUserId}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="block text-gray-500">Location</span>
                          <span>{transaction.location?.name || 'Unknown'}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">Date</span>
                          <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                        </div>
                        {transaction.temperature && (
                          <div>
                            <span className="block text-gray-500">Temperature</span>
                            <span>{transaction.temperature}°C</span>
                          </div>
                        )}
                        {transaction.humidity && (
                          <div>
                            <span className="block text-gray-500">Humidity</span>
                            <span>{transaction.humidity}%</span>
                          </div>
                        )}
                      </div>
                      {transaction.details && (
                        <>
                          <Separator className="my-2" />
                          <div className="text-xs">
                            <span className="block text-gray-500">Additional Details</span>
                            <pre className="text-xs whitespace-pre-wrap mt-1">
                              {JSON.stringify(transaction.details, null, 2)}
                            </pre>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-500 mb-4">No transactions recorded yet</p>
                  <Link href={`/transactions/new?productId=${product.id}`}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Create Transaction
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scans" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Authentication Scans</CardTitle>
              <CardDescription>
                History of QR code scans and product authentications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingScans ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : scans && scans.length > 0 ? (
                <div className="space-y-3">
                  {scans.map((scan: any) => (
                    <div key={scan.id} className="flex justify-between border rounded-lg p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={scan.isAuthentic ? "default" : "destructive"}>
                            {scan.isAuthentic ? "Authentic" : "Non-Authentic"}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            User ID: {scan.userId || 'Anonymous'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(scan.timestamp).toLocaleString()} • 
                          {scan.location ? ` ${scan.location.name}` : ' Unknown location'}
                        </p>
                        {scan.notes && (
                          <p className="text-xs text-gray-600 mt-1">{scan.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Device Info</div>
                        <p className="text-xs truncate max-w-xs">
                          {scan.deviceInfo?.userAgent?.substring(0, 30)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-500">No authentication scans recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}