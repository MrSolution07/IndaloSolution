import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Integration } from "@shared/schema";
import IntegrationCard from "@/components/integrations/integration-card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { integrationProviders } from "@/lib/integration-providers";

export default function Integrations() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [integrationName, setIntegrationName] = useState("");
  
  const { data: integrations, isLoading } = useQuery<Integration[]>({
    queryKey: ['/api/integrations'],
  });
  
  const addIntegration = useMutation({
    mutationFn: async (newIntegration: {
      provider: string;
      name: string;
      icon: string;
      credentials: any;
    }) => {
      return await apiRequest('POST', '/api/integrations', newIntegration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Integration added",
        description: "The integration has been added successfully.",
      });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add integration. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const deleteIntegration = useMutation({
    mutationFn: async (integrationId: number) => {
      await apiRequest('DELETE', `/api/integrations/${integrationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Integration removed",
        description: "The integration has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove integration. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const toggleIntegrationStatus = useMutation({
    mutationFn: async ({ id, active }: { id: number, active: boolean }) => {
      return await apiRequest('PUT', `/api/integrations/${id}`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Integration updated",
        description: "The integration status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update integration. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleAddIntegration = () => {
    if (!selectedProvider || !integrationName) return;
    
    const provider = integrationProviders.find(p => p.id === selectedProvider);
    if (!provider) return;
    
    addIntegration.mutate({
      provider: provider.id,
      name: integrationName || provider.name,
      icon: provider.icon,
      credentials: {}, // In a real app, we'd collect and store credentials securely
    });
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProvider("");
    setIntegrationName("");
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
          <div className="mt-3 sm:mt-0">
            <Button onClick={() => setIsDialogOpen(true)}>
              Add Integration
            </Button>
          </div>
        </div>
        
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                    <div className="ml-4">
                      <div className="h-5 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))
            ) : integrations && integrations.length > 0 ? (
              <>
                {integrations.map(integration => (
                  <IntegrationCard 
                    key={integration.id} 
                    integration={integration}
                    onDelete={() => deleteIntegration.mutate(integration.id)}
                    onToggleStatus={() => toggleIntegrationStatus.mutate({
                      id: integration.id,
                      active: !integration.active
                    })}
                  />
                ))}
                <IntegrationCard 
                  isAddNew 
                  onClick={() => setIsDialogOpen(true)}
                />
              </>
            ) : (
              <div className="col-span-full text-center p-10 text-gray-500">
                <p className="mb-4">No integrations added yet.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Add Your First Integration
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Add Integration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Integration</DialogTitle>
            <DialogDescription>
              Connect to your favorite creative tools and services.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="provider">Select Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {integrationProviders.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Integration Name (optional)</Label>
              <Input
                id="name"
                placeholder="My Integration"
                value={integrationName}
                onChange={(e) => setIntegrationName(e.target.value)}
              />
            </div>
            
            {/* In a real app, we'd collect necessary credentials here */}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddIntegration} 
              disabled={!selectedProvider || addIntegration.isPending}
            >
              {addIntegration.isPending ? 'Adding...' : 'Add Integration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
