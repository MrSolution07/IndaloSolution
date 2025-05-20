import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Scan, ArrowUpRight, ShieldCheck, AlertTriangle, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    enabled: !!user,
  });
  
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['/api/products'],
    enabled: !!user,
  });
  
  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts', { unreadOnly: true }],
    enabled: !!user,
  });
  
  const unreadAlerts = Array.isArray(alerts) ? alerts.filter(alert => !alert.isRead).length : 0;
  const recentProducts = Array.isArray(products) ? products.slice(0, 3) : [];

  const StatCard = ({ title, value, subValue, icon, description, isLoading }: any) => (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-gray-700">{title}</CardTitle>
        <div className="p-2 bg-emerald-50 rounded-full text-emerald-700">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-12 animate-pulse bg-gray-200 rounded"></div>
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {subValue && (
              <p className="text-xs text-emerald-700 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                {subValue}
              </p>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.displayName || 'User'}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/scan">
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Scan className="h-4 w-4" />
              Scan Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Products Tracked"
          value={stats?.productsTracked || 0}
          subValue={stats?.productsTracked > 0 ? "Active in blockchain" : null}
          icon={<ShieldCheck className="h-5 w-5" />}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Scans Today"
          value={stats?.scansToday || 0}
          subValue={stats?.scansToday > 0 ? "Authentications" : null}
          icon={<Scan className="h-5 w-5" />}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Authentication Rate"
          value={`${stats?.authenticRate || 100}%`}
          subValue={stats?.authenticRate >= 90 ? "Excellent" : "Needs attention"}
          icon={<ShieldCheck className="h-5 w-5" />}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Alerts"
          value={unreadAlerts || 0}
          subValue={unreadAlerts > 0 ? "Unread notifications" : "All clear"}
          icon={<AlertTriangle className="h-5 w-5" />}
          isLoading={isLoadingStats}
        />
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
          <Link href="/products">
            <Button variant="outline" size="sm" className="text-emerald-700 border-emerald-200 hover:bg-emerald-50">
              View All
            </Button>
          </Link>
        </div>
        
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : recentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <a className="block">
                  <Card className="overflow-hidden h-full cursor-pointer hover:shadow-md transition-shadow">
                    <div 
                      className="h-32 bg-center bg-cover" 
                      style={{ 
                        backgroundImage: `url(${product.imageUrl || 'https://via.placeholder.com/300x150?text=No+Image'})` 
                      }}
                    />
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium line-clamp-1">{product.name}</h3>
                        <Badge 
                          className={
                            product.status === 'verified' ? 'bg-green-100 text-green-800' :
                            product.status === 'flagged' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Batch: {product.batchNumber}</span>
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {new Date(product.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">No products found</p>
              {['supplier', 'manufacturer'].includes(user?.role) && (
                <Link href="/products/create">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Add Product
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Verify Authenticity</CardTitle>
            <CardDescription className="text-amber-700">
              Scan a product's QR code to verify its authenticity and track its journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/scan">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Scan Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">View Transactions</CardTitle>
            <CardDescription className="text-emerald-700">
              See the blockchain-verified history of transactions across the supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                View Transactions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Analytics Dashboard</CardTitle>
            <CardDescription className="text-blue-700">
              View critical supply chain performance metrics and authentication statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/analytics">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}