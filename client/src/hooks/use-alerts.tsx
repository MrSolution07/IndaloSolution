import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { Bell, AlertTriangle, Truck, Thermometer, ShieldCheck, X } from "lucide-react";

// Define the types for our alerts system
export type AlertPriority = "low" | "medium" | "high" | "critical";
export type AlertCategory = "temperature" | "shipment" | "authentication" | "inventory" | "system";

export interface Alert {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  priority: AlertPriority;
  category: AlertCategory;
  read: boolean;
  resolved: boolean;
  metadata?: Record<string, any>;
}

interface AlertContextType {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read' | 'resolved'>) => void;
  markAsRead: (alertId: string) => void;
  markAsResolved: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  clearAlerts: () => void;
}

export const AlertContext = createContext<AlertContextType | null>(null);

interface AlertProviderProps {
  children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  // Calculate unread count
  const unreadCount = alerts.filter(alert => !alert.read).length;

  // Simulated alerts for demo purposes (this would connect to your real-time alerts API in production)
  useEffect(() => {
    // This is a simulation function - in a real app, this would be replaced with a WebSocket or server-sent events connection
    const simulateIncomingAlerts = () => {
      if (!notificationsEnabled) return;
      
      // Simulate occasional alerts
      const shouldSendAlert = Math.random() > 0.92; // About 8% chance each time this runs
      
      if (shouldSendAlert) {
        const alertTypes = [
          {
            title: "Temperature Alert",
            message: "Amarula shipment temperature exceeds 10°C threshold",
            priority: "high" as AlertPriority,
            category: "temperature" as AlertCategory,
            metadata: {
              productId: "AMA-" + Math.floor(Math.random() * 10000),
              temperature: (Math.random() * 5 + 10).toFixed(1),
              location: "Warehouse B"
            }
          },
          {
            title: "Shipment Delay",
            message: "Jameson delivery to Cape Town delayed by 24 hours",
            priority: "medium" as AlertPriority,
            category: "shipment" as AlertCategory,
            metadata: {
              shipmentId: "JM-" + Math.floor(Math.random() * 10000),
              newETA: "Tomorrow, 15:30",
              reason: "Road construction"
            }
          },
          {
            title: "Authentication Failure",
            message: "Multiple verification failures for KWV Brandy batch",
            priority: "critical" as AlertPriority,
            category: "authentication" as AlertCategory,
            metadata: {
              batchId: "KWV-" + Math.floor(Math.random() * 10000),
              attempts: Math.floor(Math.random() * 5) + 3,
              location: "Sandton, Johannesburg"
            }
          },
          {
            title: "Low Stock Warning",
            message: "Hennessy XO inventory below threshold",
            priority: "low" as AlertPriority,
            category: "inventory" as AlertCategory,
            metadata: {
              productId: "HXO-" + Math.floor(Math.random() * 10000),
              currentStock: Math.floor(Math.random() * 10) + 1,
              threshold: 15
            }
          }
        ];
        
        // Select a random alert type
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        // Add the alert
        addAlert(alertType);
        
        // Show a toast notification
        toast({
          title: alertType.title,
          description: alertType.message,
          variant: alertType.priority === "critical" ? "destructive" : "default"
        });
      }
    };
    
    // Run the simulation every 15 seconds
    const intervalId = setInterval(simulateIncomingAlerts, 15000);
    
    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, [notificationsEnabled]);

  // Add a new alert
  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'read' | 'resolved'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: generateAlertId(),
      timestamp: new Date(),
      read: false,
      resolved: false
    };
    
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
  };

  // Mark an alert as read
  const markAsRead = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  // Mark an alert as resolved
  const markAsResolved = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  // Dismiss (remove) an alert
  const dismissAlert = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  // Clear all alerts
  const clearAlerts = () => {
    setAlerts([]);
  };

  // Generate a unique ID for an alert
  const generateAlertId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        addAlert,
        markAsRead,
        markAsResolved,
        dismissAlert,
        clearAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

// Helper function to get icon based on alert category
export const getAlertIcon = (category: AlertCategory, className: string = "") => {
  switch (category) {
    case "temperature":
      return <Thermometer className={className} />;
    case "shipment":
      return <Truck className={className} />;
    case "authentication":
      return <ShieldCheck className={className} />;
    case "inventory":
      return <AlertTriangle className={className} />;
    case "system":
      return <Bell className={className} />;
    default:
      return <Bell className={className} />;
  }
};

// Helper function to get background color based on alert priority
export const getAlertStyle = (priority: AlertPriority) => {
  switch (priority) {
    case "low":
      return "bg-blue-50 border-blue-200";
    case "medium":
      return "bg-yellow-50 border-yellow-200";
    case "high":
      return "bg-orange-50 border-orange-200";
    case "critical":
      return "bg-red-50 border-red-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

// Helper function to get text color based on alert priority
export const getAlertTextColor = (priority: AlertPriority) => {
  switch (priority) {
    case "low":
      return "text-blue-700";
    case "medium":
      return "text-yellow-700";
    case "high":
      return "text-orange-700";
    case "critical":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};