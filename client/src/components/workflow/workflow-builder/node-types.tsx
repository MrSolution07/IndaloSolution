import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

// Trigger Node Component
const TriggerNode = memo(({ data }: NodeProps) => {
  return (
    <div className="relative workflow-step bg-white p-4 rounded-lg shadow border border-primary w-60">
      <Handle type="source" position={Position.Bottom} id="a" />
      
      <div className="flex items-center mb-2">
        <div className="h-8 w-8 rounded bg-primary-light flex items-center justify-center text-white">
          <i className={data.icon}></i>
        </div>
        <span className="ml-2 font-medium">{data.label}</span>
      </div>
      <div className="text-xs text-gray-500">{data.description}</div>
      <div className="mt-3 flex justify-end">
        <button className="text-xs text-primary">Configure</button>
      </div>
    </div>
  );
});

// Action Node Component
const ActionNode = memo(({ data }: NodeProps) => {
  return (
    <div className="relative workflow-step bg-white p-4 rounded-lg shadow border border-secondary w-60">
      <Handle type="target" position={Position.Top} id="b" />
      <Handle type="source" position={Position.Bottom} id="c" />
      
      <div className="flex items-center mb-2">
        <div className="h-8 w-8 rounded bg-secondary-light flex items-center justify-center text-white">
          <i className={data.icon}></i>
        </div>
        <span className="ml-2 font-medium">{data.label}</span>
      </div>
      <div className="text-xs text-gray-500">{data.description}</div>
      <div className="mt-3 flex justify-end">
        <button className="text-xs text-primary">Configure</button>
      </div>
    </div>
  );
});

// Logic Node Component
const LogicNode = memo(({ data }: NodeProps) => {
  return (
    <div className="relative workflow-step bg-white p-4 rounded-lg shadow border border-accent w-60">
      <Handle type="target" position={Position.Top} id="d" />
      <Handle type="source" position={Position.Bottom} id="e" />
      
      <div className="flex items-center mb-2">
        <div className="h-8 w-8 rounded bg-accent-light flex items-center justify-center text-white">
          <i className={data.icon}></i>
        </div>
        <span className="ml-2 font-medium">{data.label}</span>
      </div>
      <div className="text-xs text-gray-500">{data.description}</div>
      <div className="mt-3 flex justify-end">
        <button className="text-xs text-primary">Configure</button>
      </div>
    </div>
  );
});

export const nodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
  logicNode: LogicNode,
};
