import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { WorkflowRun, Workflow } from "@shared/schema";
import { formatDate } from "@/lib/utils";

export default function Activity() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("all");
  
  // Fetch all workflows
  const { data: workflows } = useQuery<Workflow[]>({
    queryKey: ['/api/workflows'],
  });
  
  // Get all workflow IDs
  const workflowIds = workflows?.map(w => w.id) || [];
  
  // Fetch runs for selected workflow
  const { data: runs, isLoading } = useQuery<WorkflowRun[]>({
    queryKey: ['/api/workflows', selectedWorkflow === "all" ? "all" : parseInt(selectedWorkflow), 'runs'],
    queryFn: async ({ queryKey }) => {
      if (queryKey[1] === "all") {
        // Get all runs for all workflows
        const allRuns: WorkflowRun[] = [];
        for (const id of workflowIds) {
          const response = await fetch(`/api/workflows/${id}/runs`);
          if (response.ok) {
            const workflowRuns = await response.json();
            allRuns.push(...workflowRuns);
          }
        }
        return allRuns;
      } else {
        // Get runs for a specific workflow
        const response = await fetch(`/api/workflows/${queryKey[1]}/runs`);
        if (!response.ok) {
          throw new Error('Failed to fetch workflow runs');
        }
        return await response.json();
      }
    },
    enabled: selectedWorkflow === "all" ? workflowIds.length > 0 : true,
  });
  
  const getWorkflowNameById = (id: number) => {
    const workflow = workflows?.find(w => w.id === id);
    return workflow?.name || `Workflow ${id}`;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="success">{status}</Badge>;
      case "failure":
        return <Badge variant="destructive">{status}</Badge>;
      case "in_progress":
        return <Badge variant="outline">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Sort runs by startedAt in descending order
  const sortedRuns = runs ? [...runs].sort((a, b) => {
    return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
  }) : [];
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Activity Log</h1>
          <div className="mt-3 sm:mt-0 w-full sm:w-64">
            <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by workflow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workflows</SelectItem>
                {workflows?.map(workflow => (
                  <SelectItem key={workflow.id} value={workflow.id.toString()}>
                    {workflow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Completed At</TableHead>
                <TableHead>Duration</TableHead>
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
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : sortedRuns.length > 0 ? (
                sortedRuns.map((run) => {
                  // Calculate duration
                  const startTime = new Date(run.startedAt).getTime();
                  const endTime = run.completedAt ? new Date(run.completedAt).getTime() : Date.now();
                  const durationMs = endTime - startTime;
                  const durationSec = Math.floor(durationMs / 1000);
                  const formattedDuration = durationSec < 60 
                    ? `${durationSec}s` 
                    : `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`;
                  
                  return (
                    <TableRow key={run.id}>
                      <TableCell className="font-medium">
                        {getWorkflowNameById(run.workflowId)}
                      </TableCell>
                      <TableCell>{getStatusBadge(run.status)}</TableCell>
                      <TableCell>{formatDate(new Date(run.startedAt))}</TableCell>
                      <TableCell>
                        {run.completedAt ? formatDate(new Date(run.completedAt)) : '-'}
                      </TableCell>
                      <TableCell>{formattedDuration}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No activity found for the selected workflow.
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
