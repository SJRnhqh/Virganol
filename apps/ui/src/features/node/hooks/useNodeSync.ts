// src/features/node/hooks/useNodeSync.ts

import { useMemo, useCallback } from "react";
import { type NodeChange } from "@xyflow/react";
import { NodeStore } from "@/store/NodeStore";
import { type AppNode } from "@/types/node";

/**
 * useNodeSync
 * 职责：
 * 1. 数据映射：将 Store 里的业务节点 -> 转换为 React Flow 的视图节点 (AppNode)
 * 2. 双向绑定：监听 React Flow 的拖拽事件 -> 同步回 Store
 */
export function useNodeSync() {
  // 1. 从 Zustand Store 获取原始数据
  // 使用 selector 选择器是为了性能优化（可选），直接解构也没问题
  const nodes = NodeStore((state) => state.nodes);
  const updateNodePosition = NodeStore((state) => state.updateNodePosition);

  // 2. 数据转换 (Data Mapping)
  // StoreNode (业务数据) -> AppNode (视图数据)
  const rfNodes = useMemo<AppNode[]>(
    () =>
      nodes.map((node) => ({
        id: node.id,
        // 核心映射：Store 里的 category 对应 React Flow 的 type
        type: node.category,
        position: node.position,
        // 数据透传：保证符合 BaseNodeData 接口
        data: {
          name: node.name,
          status: node.status, // 类型已在 Store 中统一，直接透传
          description: node.description,
          ip: node.ip,
        },
      })),
    [nodes], // 只有当 Store 里的 nodes 发生变化时，才重新计算
  );

  // 3. 事件处理 (Event Handling)
  // 处理 React Flow 抛出的节点变化事件（主要是拖拽引起的位移）
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // 遍历所有变化
      changes.forEach((change) => {
        // 我们只关心“位置变化”且“有具体位置数值”的情况
        if (change.type === "position" && change.position) {
          // 调用 Store 的 Action 更新状态
          updateNodePosition(change.id, change.position);
        }
      });
    },
    [updateNodePosition],
  );

  // 4. 返回给组件
  return {
    rfNodes,
    onNodesChange,
  };
}
