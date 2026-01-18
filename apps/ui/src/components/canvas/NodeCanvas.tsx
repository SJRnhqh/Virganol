import { useCallback, useMemo } from 'react';
import { type NodeChange } from '@xyflow/react';
import { useServerStore } from '@/store/useServerStore';
import { BaseCanvas } from '../base/BaseCanvas';
import ServerNode from '../../features/node/remote/server/ServerNode';

const nodeTypes = { server: ServerNode };

export function NodeCanvas() {
  const { servers, updateServerPosition, enterNode } = useServerStore();

  // 将业务数据转换为 React Flow 格式
  const nodes = useMemo(() => servers.map(server => ({
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

  // 处理位置实时更新
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          updateServerPosition(change.id, change.position);
        }
      });
    },
    [updateServerPosition]
  );

  return (
    <BaseCanvas
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onNodeDoubleClick={(_, node) => enterNode(node.id)}
    />
  );
}