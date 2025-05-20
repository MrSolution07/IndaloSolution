import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, AlertTriangle, CheckCircle, Truck, Timer } from 'lucide-react';
import { useAlerts } from '@/hooks/use-alerts';

interface TemperatureReading {
  id: string;
  productId: string;
  productName: string;
  temperature: number;
  timestamp: Date;
  location: string;
  status: 'normal' | 'warning' | 'critical';
  thresholdLow: number;
  thresholdHigh: number;
}

interface TemperatureMonitorProps {
  productId?: string;  // Optional - if provided, only monitor this specific product
  category?: string;   // Optional - if provided, only monitor this category (e.g., "Wine", "Cognac")
}

export const TemperatureMonitor: React.FC<TemperatureMonitorProps> = ({ 
  productId,
  category
}) => {
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [loading, setLoading] = useState(true);
  const { addAlert } = useAlerts();

  // In a real application, this would connect to your IoT sensors API
  // Here we'll simulate random temperature readings for demonstration purposes
  useEffect(() => {
    const generateMockReadings = () => {
      const mockLocations = ['Warehouse A', 'Warehouse B', 'Delivery Truck #1', 'Retail Store #2', 'Distribution Center'];
      const mockProducts = [
        { id: 'HXO-1234', name: 'Hennessy XO Cognac', low: 15, high: 22, category: 'Cognac' },
        { id: 'AMA-5678', name: 'Amarula Cream Liqueur', low: 6, high: 10, category: 'Liqueur' },
        { id: 'KWV-8795', name: 'KWV 10 Year Brandy', low: 12, high: 20, category: 'Brandy' },
        { id: 'MRL-3392', name: 'Meerlust Rubicon 2019', low: 14, high: 18, category: 'Wine' },
        { id: 'JAM-7701', name: 'Jameson Irish Whiskey', low: 15, high: 23, category: 'Whiskey' }
      ];

      // Filter products by productId or category if provided
      let eligibleProducts = [...mockProducts];
      if (productId) {
        eligibleProducts = eligibleProducts.filter(p => p.id === productId);
      }
      if (category) {
        eligibleProducts = eligibleProducts.filter(p => p.category === category);
      }

      // Generate random readings
      const newReadings: TemperatureReading[] = [];
      
      for (let i = 0; i < eligibleProducts.length; i++) {
        const product = eligibleProducts[i];
        const location = mockLocations[Math.floor(Math.random() * mockLocations.length)];
        
        // Decide if we should generate an out-of-range temperature occasionally
        const outOfRange = Math.random() > 0.7;
        let temperature: number;
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        
        if (outOfRange) {
          // Generate temperature that's out of range - either too high or too low
          const tooHigh = Math.random() > 0.5;
          
          if (tooHigh) {
            temperature = product.high + (Math.random() * 5);
            status = temperature > product.high + 3 ? 'critical' : 'warning';
          } else {
            temperature = product.low - (Math.random() * 5);
            status = temperature < product.low - 3 ? 'critical' : 'warning';
          }
        } else {
          // Generate temperature within range
          temperature = product.low + (Math.random() * (product.high - product.low));
        }
        
        const reading: TemperatureReading = {
          id: Math.random().toString(36).substring(2, 10),
          productId: product.id,
          productName: product.name,
          temperature: parseFloat(temperature.toFixed(1)),
          timestamp: new Date(),
          location,
          status,
          thresholdLow: product.low,
          thresholdHigh: product.high
        };
        
        newReadings.push(reading);
        
        // Create an alert for critical temperature readings
        if (status === 'critical') {
          addAlert({
            title: "Temperature Alert",
            message: `${product.name} temperature is ${temperature.toFixed(1)}°C, outside safe range of ${product.low}°C-${product.high}°C in ${location}`,
            priority: "high",
            category: "temperature",
            metadata: {
              productId: product.id,
              temperature: temperature.toFixed(1),
              location,
              thresholdLow: product.low,
              thresholdHigh: product.high
            }
          });
        }
      }
      
      setReadings(newReadings);
      setLoading(false);
    };
    
    // Generate initial readings
    generateMockReadings();
    
    // Update readings every 30 seconds
    const intervalId = setInterval(generateMockReadings, 30000);
    
    return () => clearInterval(intervalId);
  }, [productId, category, addAlert]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Thermometer className="mr-2 h-5 w-5" />
            Temperature Monitoring
          </CardTitle>
          <CardDescription>Loading temperature data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
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
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Thermometer className="mr-2 h-5 w-5" />
          Temperature Monitoring
        </CardTitle>
        <CardDescription>
          Real-time temperature tracking for products in storage and transit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {readings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No temperature data available</p>
            </div>
          ) : (
            readings.map((reading) => (
              <TemperatureReadingCard key={reading.id} reading={reading} />
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground flex items-center">
          <Timer className="h-3 w-3 mr-1" />
          Updated: {new Date().toLocaleTimeString()}
        </div>
        <Button variant="outline" size="sm">View Full History</Button>
      </CardFooter>
    </Card>
  );
};

interface TemperatureReadingCardProps {
  reading: TemperatureReading;
}

const TemperatureReadingCard: React.FC<TemperatureReadingCardProps> = ({ reading }) => {
  return (
    <div className={`p-3 rounded-md border ${getTemperatureCardStyle(reading.status)}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{reading.productName}</h4>
          <div className="flex items-center text-sm text-muted-foreground space-x-2">
            <span className="flex items-center">
              <Truck className="h-3.5 w-3.5 mr-1" />
              {reading.location}
            </span>
          </div>
        </div>
        <TemperatureBadge temperature={reading.temperature} status={reading.status} />
      </div>
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${getTemperatureProgressBarColor(reading.status)}`} 
            style={{ width: getTemperatureProgressWidth(reading) }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{reading.thresholdLow}°C</span>
          <span>{reading.thresholdHigh}°C</span>
        </div>
      </div>
    </div>
  );
};

interface TemperatureBadgeProps {
  temperature: number;
  status: 'normal' | 'warning' | 'critical';
}

const TemperatureBadge: React.FC<TemperatureBadgeProps> = ({ temperature, status }) => {
  return (
    <Badge variant="outline" className={getTemperatureBadgeStyle(status)}>
      {status !== 'normal' && (
        <AlertTriangle className="h-3 w-3 mr-1" />
      )}
      {status === 'normal' && (
        <CheckCircle className="h-3 w-3 mr-1" />
      )}
      {temperature}°C
    </Badge>
  );
};

// Helper functions for styling
function getTemperatureBadgeStyle(status: 'normal' | 'warning' | 'critical'): string {
  switch (status) {
    case 'normal':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'warning':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'critical':
      return 'bg-red-50 text-red-700 border-red-200';
  }
}

function getTemperatureCardStyle(status: 'normal' | 'warning' | 'critical'): string {
  switch (status) {
    case 'normal':
      return 'border-green-200 bg-green-50/30';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50/30';
    case 'critical':
      return 'border-red-200 bg-red-50/30';
  }
}

function getTemperatureProgressBarColor(status: 'normal' | 'warning' | 'critical'): string {
  switch (status) {
    case 'normal':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'critical':
      return 'bg-red-500';
  }
}

function getTemperatureProgressWidth(reading: TemperatureReading): string {
  // Calculate position in the range from low to high (with some padding)
  const totalRange = (reading.thresholdHigh + 5) - (reading.thresholdLow - 5);
  const position = reading.temperature - (reading.thresholdLow - 5);
  const percentage = (position / totalRange) * 100;
  
  // Clamp between 0 and 100%
  return `${Math.max(0, Math.min(100, percentage))}%`;
}

export default TemperatureMonitor;