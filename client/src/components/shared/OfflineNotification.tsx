import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useOffline } from '@/hooks/use-offline';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, UploadCloud } from 'lucide-react';

export default function OfflineNotification() {
  const { isOnline, hasOfflineData, syncOfflineData } = useOffline();
  const { toast } = useToast();
  const [show, setShow] = useState(false);
  const [showSyncAlert, setShowSyncAlert] = useState(false);

  // Show offline notification when network status changes
  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Don't worry, you can still use most features. Changes will sync when you're back online.",
        variant: "default",
      });
      setShow(true);
    } else if (show) {
      toast({
        title: "You're back online",
        description: "All your changes will now sync to the server.",
        variant: "default",
      });
      setShow(false);
      
      // If there's offline data to sync, show the sync notification
      if (hasOfflineData) {
        setShowSyncAlert(true);
      }
    }
  }, [isOnline, toast, show, hasOfflineData]);

  // Handle manual sync button click
  const handleSync = () => {
    syncOfflineData();
    toast({
      title: "Syncing data",
      description: "Your offline verifications are being uploaded to the server.",
      variant: "default",
    });
    setShowSyncAlert(false);
  };

  // Hide the sync notification after a while
  useEffect(() => {
    if (showSyncAlert) {
      const timer = setTimeout(() => {
        setShowSyncAlert(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [showSyncAlert]);

  // Don't render anything if online and no data to sync
  if (isOnline && !showSyncAlert) {
    return null;
  }

  // Show offline banner
  if (!isOnline) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 flex items-center justify-between z-50">
        <div className="flex items-center">
          <WifiOff className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">You're offline. Limited functionality available.</span>
        </div>
      </div>
    );
  }

  // Show sync notification if there's offline data to sync
  if (showSyncAlert) {
    return (
      <div className="fixed bottom-4 right-4 w-80 z-50">
        <Alert variant="default" className="bg-primary text-white border-0">
          <div className="flex items-start">
            <UploadCloud className="h-5 w-5 mr-2 mt-0.5" />
            <div className="flex-1">
              <AlertTitle>Offline data detected</AlertTitle>
              <AlertDescription className="mt-1">
                You have verifications that were made while offline. Would you like to sync them now?
                <Button 
                  className="mt-2 bg-white text-primary hover:bg-white/90" 
                  size="sm"
                  onClick={handleSync}
                >
                  Sync Now
                </Button>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return null;
}