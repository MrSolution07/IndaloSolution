import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Position,
  Node,
  Edge,
  Connection,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Workflow } from "@shared/schema";

import WorkflowBuilderSidebar from "@/components/workflow/workflow-builder/sidebar";
import { nodeTypes } from "@/components/workflow/workflow-builder/node-types";
import CustomEdge from "@/components/workflow/workflow-builder/custom-edge";

// Initial nodes for a new workflow
const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'triggerNode',
    position: { x: 250, y: 100 },
    data: { 
      label: 'New File in Dropbox',
      description: 'Triggers when a new file is added to the selected folder',
      icon: 'ri-file-upload-line',
      type: 'trigger',
    },
  },
];

interface WorkflowFormData {
  name: string;
  description: string;
}

export default function WorkflowBuilderPage() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder />
    </ReactFlowProvider>
  );
}

function WorkflowBuilder() {
  const { id } = useParams();
  const workflowId = id ? parseInt(id) : undefined;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [workflowFormData, setWorkflowFormData] = useState<WorkflowFormData>({
    name: '',
    description: '',
  });
  
  // Fetch existing workflow if editing
  const { data: workflow, isLoading } = useQuery<Workflow>({
    queryKey: ['/api/workflows', workflowId],
    enabled: !!workflowId,
  });
  
  // Initialize form and nodes/edges from existing workflow
  useEffect(() => {
    if (workflow && workflow.definition) {
      setWorkflowFormData({
        name: workflow.name,
        description: workflow.description || '',
      });
      
      // Set nodes and edges from workflow definition
      if (workflow.definition.nodes && workflow.definition.edges) {
        setNodes(workflow.definition.nodes as Node[]);
        setEdges(workflow.definition.edges as Edge[]);
      }
    }
  }, [workflow, setNodes, setEdges]);
  
  // Save workflow mutation
  const saveWorkflow = useMutation({
    mutationFn: async (data: { name: string; description: string; definition: any }) => {
      if (workflowId) {
        return await apiRequest('PUT', `/api/workflows/${workflowId}`, data);
      } else {
        return await apiRequest('POST', '/api/workflows', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      toast({
        title: "Success",
        description: `Workflow ${workflowId ? 'updated' : 'created'} successfully.`,
      });
      navigate('/workflows');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${workflowId ? 'update' : 'create'} workflow. Please try again.`,
        variant: "destructive",
      });
    },
  });
  
  // Handle node addition from sidebar
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const id = `${nodeData.nodeType}-${Date.now()}`;
      const newNode: Node = {
        id,
        type: nodeData.nodeType + 'Node',
        position,
        data: {
          label: nodeData.label,
          description: nodeData.description,
          icon: nodeData.icon,
          type: nodeData.nodeType,
        },
      };
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  
  // Handle connection between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ 
        ...params, 
        type: 'customEdge',
        animated: true,
        style: { strokeWidth: 2 },
      }, eds));
    },
    [setEdges]
  );
  
  const handleSave = () => {
    if (!workflowFormData.name) {
      setOpenSaveDialog(true);
      return;
    }
    
    const workflowData = {
      name: workflowFormData.name,
      description: workflowFormData.description,
      definition: {
        nodes,
        edges,
      },
    };
    
    saveWorkflow.mutate(workflowData);
  };
  
  const handleSaveDialogConfirm = () => {
    const workflowData = {
      name: workflowFormData.name,
      description: workflowFormData.description,
      definition: {
        nodes,
        edges,
      },
    };
    
    saveWorkflow.mutate(workflowData);
    setOpenSaveDialog(false);
  };
  
  const edgeTypes = {
    customEdge: CustomEdge,
  };
  
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Workflow Builder Sidebar */}
      <WorkflowBuilderSidebar />
      
      {/* Workflow Canvas */}
      <div className="flex-1 h-full overflow-auto bg-gray-50 p-3">
        <div ref={reactFlowWrapper} className="h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            minZoom={0.2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          >
            <Controls />
            <MiniMap />
            <Background gap={20} size={1} color="#f0f0f0" />
            
            <Panel position="top-right">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/workflows')}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saveWorkflow.isPending}
                >
                  {saveWorkflow.isPending ? 'Saving...' : 'Save Workflow'}
                </Button>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
      
      {/* Save Dialog */}
      <Dialog open={openSaveDialog} onOpenChange={setOpenSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Workflow</DialogTitle>
            <DialogDescription>
              Give your workflow a name and description before saving.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Name</Label>
              <Input
                id="workflow-name"
                placeholder="My Workflow"
                value={workflowFormData.name}
                onChange={(e) => setWorkflowFormData({ ...workflowFormData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Description (optional)</Label>
              <Textarea
                id="workflow-description"
                placeholder="What does this workflow do?"
                value={workflowFormData.description}
                onChange={(e) => setWorkflowFormData({ ...workflowFormData, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDialogConfirm} disabled={!workflowFormData.name}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
