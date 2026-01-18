import { useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  type Node,
  type NodeChange,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css'; 

import { useServerStore } from '../../store/useServerStore';
import ServerNode, { type ServerNodeData } from './ServerNode';

export function CanvasWorkspace() {
  const { servers, updateServerPosition, enterNode } = useServerStore();

  const nodes: Node<ServerNodeData>[] = useMemo(() => servers.map(server => ({
    id: server.id,
    type: 'server',
    position: server.position,
    data: { 
      name: server.name, 
      host: server.host, 
      username: server.username,
      status: server.status 
    },
  })), [servers]);

  const nodeTypes = useMemo(() => ({
    server: ServerNode,
  }), []);

  // 👇 修复重点：让拖拽实时生效
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach(change => {
        // ❌ 之前的问题代码：&& change.dragging === false
        // ✅ 现在的修正代码：只要有位置变化，立刻更新 Store
        if (change.type === 'position' && change.position) {
           updateServerPosition(change.id, change.position);
        }
      });
    },
    [updateServerPosition]
  );

  return (
    <div className="w-full h-full bg-[#FAF7F0]">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
        minZoom={0.5} 
        maxZoom={2.0}
        defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
        proOptions={{ hideAttribution: true }}
        className="touch-none"
        onNodeDoubleClick={(_, node) => enterNode(node.id)} 
      >
        <Background 
          color="#2F3E46" 
          gap={24} 
          size={1.5} 
          variant={BackgroundVariant.Dots}
          className="opacity-20!" 
        />
        <Controls 
          className="bg-white/60! border-none! shadow-sm! m-4! fill-[#84A59D]!" 
          showInteractive={false} 
        />
      </ReactFlow>
    </div>
  );
}