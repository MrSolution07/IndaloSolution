import { NodeProps } from 'reactflow';

export interface WorkflowTemplateDefinition {
  name: string;
  description: string;
  category: string;
  tags: string[];
  steps: number;
  icon: string;
  definition: {
    nodes: NodeDefinition[];
    edges: EdgeDefinition[];
  };
}

interface NodeDefinition {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    icon: string;
    type: string;
  };
}

interface EdgeDefinition {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
}

// Pre-defined workflow templates
export const workflowTemplates: WorkflowTemplateDefinition[] = [
  {
    name: "Image Batch Processing",
    description: "Automatically process and distribute images across multiple platforms.",
    category: "Photography",
    tags: ["Photography", "Adobe", "Social Media"],
    steps: 4,
    icon: "ri-image-line",
    definition: {
      nodes: [
        {
          id: 'trigger-1',
          type: 'triggerNode',
          position: { x: 250, y: 50 },
          data: {
            label: 'New Image in Dropbox',
            description: 'Triggers when a new image is added to selected folder',
            icon: 'ri-file-upload-line',
            type: 'trigger',
          },
        },
        {
          id: 'action-1',
          type: 'actionNode',
          position: { x: 250, y: 180 },
          data: {
            label: 'Edit in Photoshop',
            description: 'Apply Photoshop preset to the image',
            icon: 'ri-image-edit-line',
            type: 'action',
          },
        },
        {
          id: 'action-2',
          type: 'actionNode',
          position: { x: 250, y: 310 },
          data: {
            label: 'Resize Images',
            description: 'Create multiple sizes for different platforms',
            icon: 'ri-aspect-ratio-line',
            type: 'action',
          },
        },
        {
          id: 'action-3',
          type: 'actionNode',
          position: { x: 250, y: 440 },
          data: {
            label: 'Post to Instagram',
            description: 'Publish processed image to Instagram',
            icon: 'ri-instagram-line',
            type: 'action',
          },
        },
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'trigger-1',
          target: 'action-1',
          type: 'customEdge',
          animated: true,
        },
        {
          id: 'edge-2',
          source: 'action-1',
          target: 'action-2',
          type: 'customEdge',
          animated: true,
        },
        {
          id: 'edge-3',
          source: 'action-2',
          target: 'action-3',
          type: 'customEdge',
          animated: true,
        },
      ],
    },
  },
  {
    name: "Video Publish Workflow",
    description: "Automate video rendering, upload, and distribution process.",
    category: "Video",
    tags: ["Video", "Content"],
    steps: 5,
    icon: "ri-video-line",
    definition: {
      nodes: [
        {
          id: 'trigger-1',
          type: 'triggerNode',
          position: { x: 250, y: 50 },
          data: {
            label: 'New Video in Premiere',
            description: 'Triggers when a video is exported from Premiere',
            icon: 'ri-video-line',
            type: 'trigger',
          },
        },
        {
          id: 'action-1',
          type: 'actionNode',
          position: { x: 250, y: 180 },
          data: {
            label: 'Process in After Effects',
            description: 'Apply motion graphics template',
            icon: 'ri-film-line',
            type: 'action',
          },
        },
        {
          id: 'action-2',
          type: 'actionNode',
          position: { x: 250, y: 310 },
          data: {
            label: 'Generate Thumbnail',
            description: 'Create thumbnail from video frame',
            icon: 'ri-image-line',
            type: 'action',
          },
        },
        {
          id: 'action-3',
          type: 'actionNode',
          position: { x: 250, y: 440 },
          data: {
            label: 'Upload to YouTube',
            description: 'Upload video with metadata to YouTube',
            icon: 'ri-youtube-line',
            type: 'action',
          },
        },
        {
          id: 'action-4',
          type: 'actionNode',
          position: { x: 250, y: 570 },
          data: {
            label: 'Send Team Notification',
            description: 'Notify team that video is published',
            icon: 'ri-notification-line',
            type: 'action',
          },
        },
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'trigger-1',
          target: 'action-1',
          type: 'customEdge',
          animated: true,
        },
        {
          id: 'edge-2',
          source: 'action-1',
          target: 'action-2',
          type: 'customEdge',
          animated: true,
        },
        {
          id: 'edge-3',
          source: 'action-2',
          target: 'action-3',
          type: 'customEdge',
          animated: true,
        },
        {
          id: 'edge-4',
          source: 'action-3',
          target: 'action-4',
          type: 'customEdge',
          animated: true,
        },
      ],
    },
  },
  {
    name: "Design Review Alerts",
    description: "Notify team members when designs are ready for review.",
    category: "Collaboration",
    tags: ["Collaboration", "Notifications"],
    steps: 3,
    icon: "ri-notification-3-line",
    definition: {
      nodes: [
        {
          id: 'trigger-1',
          type: 'triggerNode',
          position: { x: 250, y: 50 },
          data: {
            label: 'New Design in Figma',
            description: 'Triggers when design is marked for review',
            icon: 'ri-file-upload-line',
            type: 'trigger',
          },
        },
        {
          id: 'action-1',
          type: 'actionNode',
          position: { x: 250, y: 180 },
          data: {
            label: 'Generate Design Preview',
            description: 'Create preview images of the design',
            icon: 'ri-image-line',
            type: 'action',
          },
        },
        {
          id: 'action-2',
          type: 'actionNode',
          position: { x: 250, y: 310 },
          data: {
            label: 'Send Review Request',
            description: 'Notify team via email and Slack',
            icon: 'ri-mail-send-line',
            type: 'action',
          },
        },
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'trigger-1',
          target: 'action-1',
          type: 'customEdge',
          animated: true,
        },
        {
          id: 'edge-2',
          source: 'action-1',
          target: 'action-2',
          type: 'customEdge',
          animated: true,
        },
      ],
    },
  },
];
