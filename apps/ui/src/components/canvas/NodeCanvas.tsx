import { useCallback, useMemo } from "react";
import { type NodeChange } from "@xyflow/react";
import { NodeStore } from "@/store/NodeStore"; // 注意引用路径更新
import { BaseCanvas } from "../base/BaseCanvas";
import { HomeNode } from "../../features/node/home/HomeNode";
import { useTerminalStore } from "@/store/TerminalStore";

// 🌟 注册节点类型字典：告诉 React Flow "home" 类型对应哪个组件
const nodeTypes = {
  home: HomeNode,
  // remote: ServerNode, // 未来可以在这里解开注释
};

export function NodeCanvas() {
  const { nodes, updateNodePosition } = NodeStore();
  const { openTerminal } = useTerminalStore();

  // 🌟 翻译官：将 Store 里的业务数据 -> 转换为 React Flow 的视觉数据
  const rfNodes = useMemo(
    () =>
      nodes.map((node) => ({
        id: node.id,
        type: node.category, // 关键点：这里是 "home"，所以会渲染 HomeNode
        position: node.position,
        data: {
          // 只传递 UI 需要的数据
          name: node.name,
          status: node.status,
          description: node.description,
        },
      })),
    [nodes],
  );

  // 处理拖拽反馈
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          updateNodePosition(change.id, change.position);
        }
      });
    },
    [updateNodePosition],
  );

  return (
    <BaseCanvas
      nodes={rfNodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      // 🌟 核心：双击节点打开终端
      onNodeDoubleClick={(_, node) => {
        // 将 node.data 里的 name 传进去
        openTerminal(node.id, node.data.name as string);
      }}
    />
  );
}
