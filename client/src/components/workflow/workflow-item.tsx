import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { MoreHorizontal, FileEdit, Play, Pause, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workflow } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Map workflow status to icon
const statusIcons = {
  active: "ri-file-transfer-line",
  paused: "ri-calendar-2-line",
  draft: "ri-draft-line",
};

interface WorkflowItemProps {
  workflow: Workflow;
}

export default function WorkflowItem({ workflow }: WorkflowItemProps) {
  const { toast } = useToast();
  
  // Define icons based on workflow name (in a real app, this would come from the workflow data)
  const getWorkflowIcon = (name: string) => {
    if (name.toLowerCase().includes('photo')) return "ri-file-transfer-line";
    if (name.toLowerCase().includes('event')) return "ri-calendar-2-line";
    if (name.toLowerCase().includes('video')) return "ri-video-line";
    return "ri-flow-chart";
  };
  
  // Get appropriate background color
  const getWorkflowIconBg = (name: string) => {
    if (name.toLowerCase().includes('photo')) return "bg-primary-light";
    if (name.toLowerCase().includes('event')) return "bg-secondary-light";
    if (name.toLowerCase().includes('video')) return "bg-accent-light";
    return "bg-primary-light";
  };
  
  // Get sources string
  const getSourcesString = (name: string) => {
    if (name.includes('Photoshop') && name.includes('Figma')) 
      return "Adobe Creative Cloud → Figma";
    if (name.includes('Event') && name.includes('Photo')) 
      return "Lightroom → Dropbox → Instagram";
    if (name.includes('Video')) 
      return "Premiere Pro → After Effects → YouTube";
    return "Multiple Sources";
  };
  
  const updateWorkflowStatus = useMutation({
    mutationFn: async (status: string) => {
      return await apiRequest('PUT', `/api/workflows/${workflow.id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      toast({
        title: "Workflow updated",
        description: "Workflow status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update workflow status. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const deleteWorkflow = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/workflows/${workflow.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      toast({
        title: "Workflow deleted",
        description: "The workflow has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete workflow. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const executeWorkflow = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', `/api/workflows/${workflow.id}/runs`, {});
    },
    onSuccess: () => {
      toast({
        title: "Workflow execution started",
        description: "The workflow execution has been triggered.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to execute workflow. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const icon = getWorkflowIcon(workflow.name);
  const iconBg = getWorkflowIconBg(workflow.name);
  const sourcesString = getSourcesString(workflow.name);
  
  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="min-w-0 flex-1 flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-10 w-10 rounded-md ${iconBg} flex items-center justify-center text-white`}>
                  <i className={`${icon} text-lg`}></i>
                </div>
              </div>
              <div className="min-w-0 flex-1 px-4">
                <div>
                  <Link href={`/workflow-builder/${workflow.id}`}>
                    <a className="text-sm font-medium text-primary truncate hover:underline">
                      {workflow.name}
                    </a>
                  </Link>
                  <p className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="truncate">{sourcesString}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-5 flex-shrink-0 flex items-center space-x-4">
            <Badge 
              variant={workflow.status === 'active' ? 'success' : 
                      workflow.status === 'paused' ? 'warning' : 
                      'outline'}
            >
              {workflow.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/workflow-builder/${workflow.id}`}>
                    <a className="flex items-center">
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => executeWorkflow.mutate()}>
                  <Play className="mr-2 h-4 w-4" />
                  <span>Run Now</span>
                </DropdownMenuItem>
                {workflow.status === 'active' ? (
                  <DropdownMenuItem onClick={() => updateWorkflowStatus.mutate('paused')}>
                    <Pause className="mr-2 h-4 w-4" />
                    <span>Pause</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => updateWorkflowStatus.mutate('active')}>
                    <Play className="mr-2 h-4 w-4" />
                    <span>Activate</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => deleteWorkflow.mutate()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </li>
  );
}
