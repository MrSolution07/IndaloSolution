import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { PlusIcon } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Workflow } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Workflows() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: workflows, isLoading } = useQuery<Workflow[]>({
    queryKey: ['/api/workflows'],
  });
  
  const deleteWorkflow = useMutation({
    mutationFn: async (workflowId: number) => {
      await apiRequest('DELETE', `/api/workflows/${workflowId}`);
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
  
  const updateWorkflowStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return await apiRequest('PUT', `/api/workflows/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      toast({
        title: "Workflow updated",
        description: "The workflow status has been updated successfully.",
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
  
  const executeWorkflow = useMutation({
    mutationFn: async (workflowId: number) => {
      return await apiRequest('POST', `/api/workflows/${workflowId}/runs`, {});
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">{status}</Badge>;
      case "paused":
        return <Badge variant="warning">{status}</Badge>;
      case "draft":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Workflows</h1>
          <div className="mt-3 sm:mt-0">
            <Button asChild>
              <Link href="/workflow-builder">
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                New Workflow
              </Link>
            </Button>
          </div>
        </div>
        
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Run Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : workflows && workflows.length > 0 ? (
                workflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">{workflow.name}</TableCell>
                    <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                    <TableCell>
                      {workflow.lastRunAt ? formatDate(new Date(workflow.lastRunAt)) : "Never"}
                    </TableCell>
                    <TableCell>{workflow.runCount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/workflow-builder/${workflow.id}`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => executeWorkflow.mutate(workflow.id)}
                          >
                            Run Now
                          </DropdownMenuItem>
                          {workflow.status === "active" ? (
                            <DropdownMenuItem 
                              onClick={() => updateWorkflowStatus.mutate({ id: workflow.id, status: "paused" })}
                            >
                              Pause
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => updateWorkflowStatus.mutate({ id: workflow.id, status: "active" })}
                            >
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteWorkflow.mutate(workflow.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No workflows found. Create your first workflow to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
