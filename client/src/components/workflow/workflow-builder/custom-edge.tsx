import { memo } from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

export default memo(({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, markerEnd }: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={{
        ...style,
        strokeDasharray: 5,
        animation: 'dash 30s linear infinite',
      }}
      className="react-flow__edge-path connection-line"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
});
