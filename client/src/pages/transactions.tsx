import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Truck, Filter, Clock, Search, ChevronDown, ChevronUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Transactions() {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });

  // Since we don't have a dedicated endpoint to get all transactions,
  // we'll stitch together transactions from all products
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Fetch transactions for each product
  useQuery({
    queryKey: ['/api/all-transactions'],
    enabled: !!products && products.length > 0,
    queryFn: async () => {
      setIsLoadingTransactions(true);
      
      try {
        if (!products || products.length === 0) return [];
        
        // Create an array of promises for each product's transactions
        const transactionPromises = products.map(async (product: any) => {
          const res = await fetch(`/api/products/${product.id}/transactions`);
          if (!res.ok) return [];
          
          const transactions = await res.json();
          return transactions.map((tx: any) => ({
            ...tx,
            productName: product.name,
            productId: product.id
          }));
        });
        
        // Wait for all promises to resolve
        const transactionsArrays = await Promise.all(transactionPromises);
        
        // Flatten array of arrays
        const combinedTransactions = transactionsArrays.flat();
        
        setAllTransactions(combinedTransactions);
        return combinedTransactions;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
      } finally {
        setIsLoadingTransactions(false);
      }
    },
  });

  // Filter and sort transactions
  const filteredTransactions = allTransactions.filter((transaction: any) => {
    const matchesSearch = 
      (transaction.productName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.type?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.blockchainHash?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    const transactionDate = new Date(transaction.timestamp);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = daysDiff < 1;
    } else if (dateFilter === "week") {
      matchesDate = daysDiff < 7;
    } else if (dateFilter === "month") {
      matchesDate = daysDiff < 30;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a: any, b: any) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleExpand = (id: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatTransactionType = (type: string) => {
    return type.replace(/_/g, ' ').split(' ').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusColor = (verified: boolean) => {
    return verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-6 w-6 text-emerald-600" />
            Transactions
          </h1>
          <p className="text-gray-500">View and manage supply chain transactions</p>
        </div>
        
        {(['supplier', 'manufacturer', 'distributor', 'retailer'].includes(user?.role)) && (
          <Link href="/transactions/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              New Transaction
            </Button>
          </Link>
        )}
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search transactions by product, type, or hash"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 h-4 w-4 flex-shrink-0" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="receiving">Receiving</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="text-gray-400 h-4 w-4 flex-shrink-0" />
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Transaction History</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 text-sm"
            >
              Sort by Date
              {sortOrder === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : sortedTransactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From / To</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((transaction: any) => (
                    <Collapsible
                      key={transaction.id}
                      open={expandedRows[transaction.id]}
                      onOpenChange={() => toggleExpand(transaction.id)}
                    >
                      <TableRow>
                        <TableCell>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                              {expandedRows[transaction.id] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link href={`/products/${transaction.productId}`}>
                            <a className="hover:text-emerald-600">
                              {transaction.productName || `Product #${transaction.productId}`}
                            </a>
                          </Link>
                        </TableCell>
                        <TableCell>{formatTransactionType(transaction.type)}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <span className="block">From: User #{transaction.fromUserId}</span>
                            <span className="block">To: User #{transaction.toUserId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.verificationStatus)}>
                            {transaction.verificationStatus ? "Verified" : "Unverified"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/transactions/${transaction.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={7} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {transaction.location && (
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Location</h4>
                                  <p className="text-sm">{transaction.location.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Coordinates: {transaction.location.latitude.toFixed(4)}, {transaction.location.longitude.toFixed(4)}
                                  </p>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Conditions</h4>
                                <div className="grid grid-cols-2 gap-x-4 text-sm">
                                  {transaction.temperature && (
                                    <p>Temperature: {transaction.temperature}°C</p>
                                  )}
                                  {transaction.humidity && (
                                    <p>Humidity: {transaction.humidity}%</p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-1">Blockchain</h4>
                                <p className="text-xs text-muted-foreground break-all">
                                  {transaction.blockchainHash}
                                </p>
                              </div>
                              
                              {transaction.details && Object.keys(transaction.details).length > 0 && (
                                <div className="md:col-span-3">
                                  <h4 className="text-sm font-medium mb-1">Additional Details</h4>
                                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                                    {JSON.stringify(transaction.details, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Transactions Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || typeFilter !== "all" || dateFilter !== "all" 
                  ? "Try adjusting your filters or search terms"
                  : "Start recording transactions to track products across the supply chain"}
              </p>
              
              {(['supplier', 'manufacturer', 'distributor', 'retailer'].includes(user?.role)) && (
                <Link href="/transactions/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Create First Transaction
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}