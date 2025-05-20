import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Link as LinkIcon, RefreshCw, AlertTriangle, Search, ArrowUpRight, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  blockchainReference: string;
  timestamp: Date;
  type: 'product_registration' | 'verification' | 'transfer' | 'certification' | 'shipment';
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  metadata: {
    product?: {
      id: string;
      name: string;
    };
    from?: string;
    to?: string;
    details?: string;
  };
}

interface TransactionTrackerProps {
  productId?: string;
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
}

export const TransactionTracker: React.FC<TransactionTrackerProps> = ({
  productId,
  limit = 5,
  showTitle = true,
  compact = false
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // This would be connected to your blockchain API in a real application
  useEffect(() => {
    const generateMockTransactions = () => {
      const types: Transaction['type'][] = [
        'product_registration',
        'verification',
        'transfer',
        'certification',
        'shipment'
      ];

      const products = [
        { id: 'HXO-1234', name: 'Hennessy XO Cognac' },
        { id: 'AMA-5678', name: 'Amarula Cream Liqueur' },
        { id: 'KWV-8795', name: 'KWV 10 Year Brandy' },
        { id: 'MRL-3392', name: 'Meerlust Rubicon 2019' },
        { id: 'JAM-7701', name: 'Jameson Irish Whiskey' }
      ];

      const parties = [
        'Producer #123',
        'Distributor #456',
        'Warehouse #789',
        'Retailer #101',
        'Transport #202'
      ];

      // Generate between 5 and 10 transactions
      const count = Math.max(5, Math.floor(Math.random() * 10));
      const mockTransactions: Transaction[] = [];

      for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const product = productId 
          ? products.find(p => p.id === productId) || products[0]
          : products[Math.floor(Math.random() * products.length)];
        
        // Most transactions should be confirmed, but occasionally some are pending or failed
        let status: Transaction['status'] = 'confirmed';
        const rand = Math.random();
        if (rand > 0.8 && rand < 0.95) {
          status = 'pending';
        } else if (rand >= 0.95) {
          status = 'failed';
        }

        const mockTransaction: Transaction = {
          id: Math.random().toString(36).substring(2, 15),
          blockchainReference: '0x' + Math.random().toString(16).substring(2, 42),
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
          type,
          status,
          confirmations: status === 'confirmed' ? Math.floor(Math.random() * 30) + 1 : 0,
          metadata: {
            product,
          }
        };

        // Add specific metadata based on transaction type
        if (type === 'transfer' || type === 'shipment') {
          const fromIndex = Math.floor(Math.random() * parties.length);
          let toIndex = Math.floor(Math.random() * parties.length);
          // Ensure from and to are different
          while (toIndex === fromIndex) {
            toIndex = Math.floor(Math.random() * parties.length);
          }
          
          mockTransaction.metadata.from = parties[fromIndex];
          mockTransaction.metadata.to = parties[toIndex];
        }
        
        if (type === 'verification') {
          mockTransaction.metadata.details = 'Authentication code verified via QR scan';
        }
        
        if (type === 'certification') {
          mockTransaction.metadata.details = 'Product certified by South African Wine and Spirit Board';
        }

        mockTransactions.push(mockTransaction);
      }

      // Sort by timestamp, newest first
      mockTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      // Apply limit if specified
      const limitedTransactions = limit ? mockTransactions.slice(0, limit) : mockTransactions;
      
      setTransactions(limitedTransactions);
      setLoading(false);
    };

    generateMockTransactions();
    
    // Refresh every 30 seconds to simulate new blockchain transactions
    const intervalId = setInterval(generateMockTransactions, 30000);
    
    return () => clearInterval(intervalId);
  }, [productId, limit]);

  const getTransactionTypeLabel = (type: Transaction['type']): string => {
    switch (type) {
      case 'product_registration':
        return 'Product Registration';
      case 'verification':
        return 'Product Verification';
      case 'transfer':
        return 'Ownership Transfer';
      case 'certification':
        return 'Certification';
      case 'shipment':
        return 'Shipment Record';
      default:
        return 'Transaction';
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const handleCopyBlockchainReference = (reference: string) => {
    navigator.clipboard.writeText(reference);
    toast({
      title: "Copied to clipboard",
      description: "Blockchain reference copied",
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    // In a real app this would fetch new data from the blockchain
    setTimeout(() => {
      const current = new Date();
      setTransactions(prevTransactions => 
        prevTransactions.map(tx => ({
          ...tx,
          // Update confirmations for pending transactions
          confirmations: tx.status === 'pending' ? Math.min(tx.confirmations + 1, 3) : tx.confirmations,
          // Mark some pending transactions as confirmed
          status: tx.status === 'pending' && Math.random() > 0.5 ? 'confirmed' : tx.status
        }))
      );
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center">
              <LinkIcon className="mr-2 h-5 w-5" />
              Blockchain Transactions
            </CardTitle>
            <CardDescription>Loading blockchain data...</CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4 border p-3 rounded-md">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-2 bg-slate-200 rounded"></div>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'border-0 shadow-none' : undefined}>
      {showTitle && (
        <CardHeader className={compact ? 'px-0 pb-3' : undefined}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <LinkIcon className="mr-2 h-5 w-5" />
                Blockchain Transactions
              </CardTitle>
              <CardDescription>
                Recent blockchain activity for{productId ? ' this product' : ' all products'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className={compact ? 'px-0' : undefined}>
        {transactions.length === 0 ? (
          <div className="text-center p-6">
            <LinkIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No blockchain transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className={`border p-3 rounded-md ${
                  transaction.status === 'pending' 
                    ? 'border-yellow-200 bg-yellow-50/30' 
                    : transaction.status === 'failed'
                    ? 'border-red-200 bg-red-50/30'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`rounded-full p-2 mr-3 ${
                      transaction.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : transaction.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {transaction.status === 'pending' 
                        ? <Clock className="h-4 w-4" /> 
                        : transaction.status === 'failed'
                        ? <AlertTriangle className="h-4 w-4" />
                        : <CheckCircle className="h-4 w-4" />
                      }
                    </div>
                    <div>
                      <h4 className="font-medium">{getTransactionTypeLabel(transaction.type)}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{getRelativeTime(transaction.timestamp)}</span>
                        {transaction.status === 'confirmed' && (
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                            {transaction.confirmations} confirmations
                          </Badge>
                        )}
                        {transaction.status === 'pending' && (
                          <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                            Pending
                          </Badge>
                        )}
                        {transaction.status === 'failed' && (
                          <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                            Failed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 text-sm">
                  {transaction.metadata.product && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Product:</span>
                      <span>{transaction.metadata.product.name}</span>
                    </div>
                  )}
                  
                  {transaction.metadata.from && transaction.metadata.to && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-muted-foreground">Transfer:</span>
                      <span>{transaction.metadata.from} → {transaction.metadata.to}</span>
                    </div>
                  )}
                  
                  {transaction.metadata.details && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-muted-foreground">Details:</span>
                      <span>{transaction.metadata.details}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="truncate max-w-[200px] font-mono text-muted-foreground flex">
                      {transaction.blockchainReference}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleCopyBlockchainReference(transaction.blockchainReference)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                      >
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {!compact && (
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            Powered by Indalo Blockchain
          </div>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search Transactions
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TransactionTracker;