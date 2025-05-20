import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkflowTemplate } from "@shared/schema";
import WorkflowTemplateCard from "@/components/workflow/workflow-template-card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Templates() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: templates, isLoading } = useQuery<WorkflowTemplate[]>({
    queryKey: ['/api/workflow-templates'],
  });
  
  const useTemplate = useMutation({
    mutationFn: async (template: WorkflowTemplate) => {
      // Create a new workflow from the template
      return await apiRequest('POST', '/api/workflows', {
        name: template.name,
        description: template.description,
        status: 'draft',
        definition: template.definition,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      toast({
        title: "Template applied",
        description: "A new workflow has been created from the template.",
      });
      
      // Navigate to the workflow builder with the new workflow
      navigate(`/workflow-builder/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create workflow from template. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleUseTemplate = (template: WorkflowTemplate) => {
    useTemplate.mutate(template);
  };
  
  const groups = templates ? [
    {
      category: "Photography",
      templates: templates.filter(t => t.category === "Photography"),
    },
    {
      category: "Video",
      templates: templates.filter(t => t.category === "Video"),
    },
    {
      category: "Collaboration",
      templates: templates.filter(t => t.category === "Collaboration"),
    },
  ] : [];
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Workflow Templates</h1>
          <div className="mt-3 sm:mt-0">
            <Button variant="outline" onClick={() => navigate('/workflow-builder')}>
              Create Custom Workflow
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="p-5 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                  <div className="ml-4 h-5 w-1/2 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 w-10 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : templates && templates.length > 0 ? (
          <>
            {groups.map((group) => (
              group.templates.length > 0 && (
                <div key={group.category} className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 font-heading">
                    {group.category}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.templates.map(template => (
                      <WorkflowTemplateCard 
                        key={template.id} 
                        template={template} 
                        onUseTemplate={handleUseTemplate}
                        isPending={useTemplate.isPending}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}
          </>
        ) : (
          <Card className="p-6 text-center text-gray-500">
            No templates available. Check back later for new templates.
          </Card>
        )}
      </div>
    </div>
  );
}
