// src/features/node/components/NodeCanvas.tsx
import { BaseCanvas } from "@/components/base/BaseCanvas";
import { HomeNode } from "../home/HomeNode";
import { useTerminalStore } from "@/store/TerminalStore";
import { useNodeSync } from "@/features/node/hooks/useNodeSync";
import { type Node } from "@xyflow/react";
// 1. 引入新定义的类型
import { type AppNode, NODE_CATEGORIES } from "@/types/node";

// 2. 类型字典使用常量 Key，防止拼写错误
const nodeTypes = {
  [NODE_CATEGORIES.HOME]: HomeNode,
  // [NODE_CATEGORIES.REMOTE]: ServerNode,
};

export function NodeCanvas() {
  // 3. 🌟 泛型显威：告诉 useMemo 返回的是标准的 AppNode 数组
  const { rfNodes, onNodesChange } = useNodeSync();
  const { openTerminal } = useTerminalStore();

  return (
    <BaseCanvas
      nodes={rfNodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      // 4. 🌟 参数直接标注为 AppNode，无需 any 或断言
      onNodeDoubleClick={(_, genericNode: Node) => {
        // 🌟 关键修复：先接收通用 Node，再断言为 AppNode
        const node = genericNode as AppNode;
        // 现在 TS 知道它是 AppNode 了，可以安全访问 .data.name
        openTerminal(node.id, node.data.name);
      }}
    />
  );
}
