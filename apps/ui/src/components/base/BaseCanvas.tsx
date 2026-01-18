import { 
  ReactFlow, 
  Background, 
  Controls, 
  BackgroundVariant,
  type Node,
  type NodeChange,
  type NodeTypes,
  type ReactFlowProps
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface BaseCanvasProps extends ReactFlowProps {
  nodes: Node[];
  nodeTypes: NodeTypes;
  onNodesChange: (changes: NodeChange[]) => void;
  onNodeDoubleClick?: (event: React.MouseEvent, node: Node) => void;
}

/**
 * V.I.N.E. 基础设施层：通用画布底座
 * 负责定义全局的视觉风格（网格、缩放控制、背景色）
 */
export function BaseCanvas({
  nodes,
  nodeTypes,
  onNodesChange,
  onNodeDoubleClick,
  children,
  ...rest
}: BaseCanvasProps) {
  return (
    <div className="w-full h-full bg-[#FAF7F0]"> {/* 使用你选定的呼吸感背景色 */}
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        minZoom={0.5}
        maxZoom={2.0}
        defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
        proOptions={{ hideAttribution: true }}
        className="touch-none"
        {...rest}
      >
        {/* 精密网格：Dots 变体，低不透明度 */}
        <Background 
          color="#2F3E46" 
          gap={24} 
          size={1.5} 
          variant={BackgroundVariant.Dots}
          className="opacity-20!" 
        />
        {/* 自定义控制器样式 */}
        <Controls 
          className="bg-white/60! border-none! shadow-sm! m-4! fill-[#84A59D]!" 
          showInteractive={false} 
        />
        {children}
      </ReactFlow>
    </div>
  );
}