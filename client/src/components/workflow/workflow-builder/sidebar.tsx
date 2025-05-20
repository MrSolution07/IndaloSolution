import { DragEvent } from "react";

interface NodeType {
  type: string;
  nodeType: string;
  label: string;
  description: string;
  icon: string;
}

const triggers: NodeType[] = [
  {
    type: 'trigger',
    nodeType: 'trigger',
    label: 'New File Upload',
    description: 'Triggers when a new file is uploaded',
    icon: 'ri-file-upload-line',
  },
  {
    type: 'trigger',
    nodeType: 'trigger',
    label: 'Schedule',
    description: 'Runs at a specified schedule',
    icon: 'ri-time-line',
  },
  {
    type: 'trigger',
    nodeType: 'trigger',
    label: 'Webhook',
    description: 'Triggers when a webhook is received',
    icon: 'ri-notification-3-line',
  },
];

const actions: NodeType[] = [
  {
    type: 'action',
    nodeType: 'action',
    label: 'Edit in Photoshop',
    description: 'Apply Photoshop action to image file',
    icon: 'ri-image-edit-line',
  },
  {
    type: 'action',
    nodeType: 'action',
    label: 'Export to Figma',
    description: 'Send file to Figma as a new frame',
    icon: 'ri-file-transfer-line',
  },
  {
    type: 'action',
    nodeType: 'action',
    label: 'Upload to Drive',
    description: 'Upload file to Google Drive',
    icon: 'ri-upload-cloud-line',
  },
  {
    type: 'action',
    nodeType: 'action',
    label: 'Send Email',
    description: 'Send email notification',
    icon: 'ri-mail-send-line',
  },
  {
    type: 'action',
    nodeType: 'action',
    label: 'Post to Instagram',
    description: 'Post image to Instagram',
    icon: 'ri-instagram-line',
  },
];

const logic: NodeType[] = [
  {
    type: 'logic',
    nodeType: 'logic',
    label: 'Condition',
    description: 'Branch based on a condition',
    icon: 'ri-git-branch-line',
  },
  {
    type: 'logic',
    nodeType: 'logic',
    label: 'Loop',
    description: 'Repeat for each item in a list',
    icon: 'ri-loop-left-line',
  },
  {
    type: 'logic',
    nodeType: 'logic',
    label: 'Delay',
    description: 'Wait for a specified time',
    icon: 'ri-timer-line',
  },
];

export default function WorkflowBuilderSidebar() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, node: NodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 h-full border-r overflow-y-auto p-3 bg-gray-50">
      <h4 className="font-medium text-sm text-gray-900 mb-2">Triggers</h4>
      <div className="space-y-2 mb-4">
        {triggers.map((trigger, index) => (
          <div
            key={index}
            className="workflow-step bg-white px-3 py-2 rounded-md shadow-sm cursor-move border border-gray-200"
            draggable
            onDragStart={(event) => onDragStart(event, trigger)}
          >
            <div className="flex items-center">
              <div className="h-6 w-6 rounded bg-primary-light flex items-center justify-center text-white">
                <i className={`${trigger.icon} text-sm`}></i>
              </div>
              <span className="ml-2 text-sm">{trigger.label}</span>
            </div>
          </div>
        ))}
      </div>

      <h4 className="font-medium text-sm text-gray-900 mb-2">Actions</h4>
      <div className="space-y-2 mb-4">
        {actions.map((action, index) => (
          <div
            key={index}
            className="workflow-step bg-white px-3 py-2 rounded-md shadow-sm cursor-move border border-gray-200"
            draggable
            onDragStart={(event) => onDragStart(event, action)}
          >
            <div className="flex items-center">
              <div className="h-6 w-6 rounded bg-secondary-light flex items-center justify-center text-white">
                <i className={`${action.icon} text-sm`}></i>
              </div>
              <span className="ml-2 text-sm">{action.label}</span>
            </div>
          </div>
        ))}
      </div>

      <h4 className="font-medium text-sm text-gray-900 mb-2">Logic</h4>
      <div className="space-y-2">
        {logic.map((logic, index) => (
          <div
            key={index}
            className="workflow-step bg-white px-3 py-2 rounded-md shadow-sm cursor-move border border-gray-200"
            draggable
            onDragStart={(event) => onDragStart(event, logic)}
          >
            <div className="flex items-center">
              <div className="h-6 w-6 rounded bg-accent-light flex items-center justify-center text-white">
                <i className={`${logic.icon} text-sm`}></i>
              </div>
              <span className="ml-2 text-sm">{logic.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
