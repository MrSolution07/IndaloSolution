import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("all");
  const [dimension, setDimension] = useState("all");
  
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics', { timeframe, dimension }],
  });
  
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });
  
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Colors for charts
  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"];
  
  // Prepare data for different charts
  const getChartData = () => {
    if (!analytics || !Array.isArray(analytics)) return [];
    
    // Group by metric name
    const metricsGroup: Record<string, any[]> = {};
    analytics.forEach((item: any) => {
      if (!metricsGroup[item.metricName]) {
        metricsGroup[item.metricName] = [];
      }
      metricsGroup[item.metricName].push(item);
    });
    
    return metricsGroup;
  };
  
  const chartData = getChartData();
  
  // Prepare authentication rate data for doughnut chart
  const getAuthRateData = () => {
    if (!stats) return [];
    
    return [
      { name: "Authentic", value: stats.authenticRate || 95 },
      { name: "Non-Authentic", value: 100 - (stats.authenticRate || 95) }
    ];
  };
  
  // Helper function to format metricNames for display
  const formatMetricName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const ChartCard = ({ title, description, chart, icon }: any) => (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {icon}
      </CardHeader>
      <CardContent className="pt-4">
        {chart}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-500">
            Track supply chain performance and insights
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-4 w-4 flex-shrink-0" />
            <Select value={dimension} onValueChange={setDimension}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Dimension" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Wine">Wine</SelectItem>
                <SelectItem value="Spirits">Spirits</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400 h-4 w-4 flex-shrink-0" />
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Products Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.productsTracked || 0}</div>
            <p className="text-xs text-emerald-600 mt-1">
              On blockchain
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Authentication Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.authenticRate || 100}%</div>
            <p className="text-xs text-emerald-600 mt-1">
              Average success rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Scans Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.scansToday || 0}</div>
            <p className="text-xs text-emerald-600 mt-1">
              Product verifications
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.alertsCount || 0}</div>
            <p className="text-xs text-emerald-600 mt-1">
              Unread notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="authenticity">Authenticity</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Rate */}
            <ChartCard 
              title="Authentication Rate" 
              description="Product verification success rate"
              icon={<PieChartIcon className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getAuthRateData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getAuthRateData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#f87171"} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              }
            />
            
            {/* Products By Category */}
            <ChartCard 
              title="Products By Category" 
              description="Distribution of tracked products"
              icon={<BarChart3 className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Wine", count: 1 },
                        { name: "Spirits", count: 2 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Products" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              }
            />
            
            {/* Product Verifications */}
            <ChartCard 
              title="Product Verifications" 
              description="QR code scans over time"
              icon={<LineChartIcon className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: "Day 1", scans: 3 },
                        { date: "Day 2", scans: 5 },
                        { date: "Day 3", scans: 2 },
                        { date: "Day 4", scans: 7 },
                        { date: "Day 5", scans: 4 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="scans" 
                        name="Scans" 
                        stroke="#10b981" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              }
            />
            
            {/* Alert Distribution */}
            <ChartCard 
              title="Alert Distribution" 
              description="Types of alerts triggered"
              icon={<PieChartIcon className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Temperature", value: 1 },
                          { name: "Verification", value: 1 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: "Temperature", value: 1 },
                          { name: "Verification", value: 1 }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              }
            />
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard 
              title="Products Created" 
              description="New products added to blockchain over time"
              icon={<BarChart3 className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "May", count: 3 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Products Created" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              }
            />
            
            <ChartCard 
              title="Product Status Distribution" 
              description="Current status of tracked products"
              icon={<PieChartIcon className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Produced", value: 1 },
                          { name: "In Transit", value: 1 },
                          { name: "Delivered", value: 1 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: "Produced", value: 1 },
                          { name: "In Transit", value: 1 },
                          { name: "Delivered", value: 1 }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              }
            />
          </div>
        </TabsContent>
        
        <TabsContent value="authenticity" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard 
              title="Authentication Rate by Product Category" 
              description="Verification success by product type"
              icon={<BarChart3 className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Wine", rate: 100 },
                        { name: "Spirits", rate: 100 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" name="Authentication Rate (%)" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              }
            />
            
            <ChartCard 
              title="Verifications Over Time" 
              description="Product authentications by day"
              icon={<LineChartIcon className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: "May 5", scans: 3 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="scans" 
                        name="Scans" 
                        stroke="#10b981" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              }
            />
          </div>
        </TabsContent>
        
        <TabsContent value="supply-chain" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard 
              title="Transactions by Type" 
              description="Distribution of supply chain activities"
              icon={<PieChartIcon className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Production", value: 1 },
                          { name: "Shipping", value: 1 },
                          { name: "Receiving", value: 1 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: "Production", value: 1 },
                          { name: "Shipping", value: 1 },
                          { name: "Receiving", value: 1 }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              }
            />
            
            <ChartCard 
              title="Temperature Alerts" 
              description="Temperature deviations by product category"
              icon={<BarChart3 className="h-5 w-5 text-emerald-600" />}
              chart={
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Spirits", count: 1 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Temperature Alerts" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}