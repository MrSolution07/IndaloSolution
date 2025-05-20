import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkflowTemplate } from "@shared/schema";

interface WorkflowTemplateCardProps {
  template: WorkflowTemplate;
  onUseTemplate?: (template: WorkflowTemplate) => void;
  isPending?: boolean;
}

export default function WorkflowTemplateCard({ 
  template, 
  onUseTemplate,
  isPending = false
}: WorkflowTemplateCardProps) {
  const getBgColor = (icon: string) => {
    if (icon.includes('image')) return "bg-primary-light";
    if (icon.includes('video')) return "bg-secondary-light";
    if (icon.includes('notification')) return "bg-accent-light";
    return "bg-primary-light";
  };
  
  const getBadgeColor = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    
    if (lowerTag.includes('photo')) return "bg-blue-100 text-blue-800";
    if (lowerTag.includes('adobe')) return "bg-purple-100 text-purple-800";
    if (lowerTag.includes('social')) return "bg-green-100 text-green-800";
    if (lowerTag.includes('video')) return "bg-red-100 text-red-800";
    if (lowerTag.includes('content')) return "bg-yellow-100 text-yellow-800";
    if (lowerTag.includes('collab')) return "bg-indigo-100 text-indigo-800";
    if (lowerTag.includes('notif')) return "bg-gray-100 text-gray-800";
    
    // Default colors
    return "bg-gray-100 text-gray-800";
  };
  
  return (
    <Card className="overflow-hidden shadow hover:shadow-md transition-shadow duration-300 border border-gray-200">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className={`flex-shrink-0 rounded-md p-2 ${getBgColor(template.icon)}`}>
            <i className={`${template.icon} text-white text-xl`}></i>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">{template.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {template.tags && template.tags.map((tag, index) => (
            <span 
              key={index} 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex justify-between items-center">
          <span className="text-xs text-gray-500">{template.steps} steps</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUseTemplate && onUseTemplate(template)}
            disabled={isPending}
          >
            {isPending ? "Processing..." : "Use Template"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
