import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type ReactFlowProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export function BaseCanvas({ children, ...props }: ReactFlowProps) {
  return (
    <div className="w-full h-full bg-main-bg transition-colors duration-500">
      <ReactFlow
        fitView
        minZoom={0.4}
        maxZoom={2.0}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "var(--canvas-edge)", strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
        className="touch-none"
        {...props}
      >
        <Background
          color="var(--canvas-grid)"
          gap={24}
          size={1.2}
          variant={BackgroundVariant.Dots}
          className="opacity-10!"
        />
        <Controls
          showInteractive={false}
          className="m-4! border-none! shadow-none!"
        />
        {children}
      </ReactFlow>
    </div>
  );
}
