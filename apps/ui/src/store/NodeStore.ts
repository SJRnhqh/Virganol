// src/store/NodeStore.ts
import { create } from "zustand";
import {
  NODE_CONFIG,
  NODE_CATEGORIES,
  type NodeCategory,
  type BaseNodeData, // 🌟 1. 引入这个类型，它是唯一的真理来源
} from "@/types/node"; // 注意检查文件名是否是 nodes.ts

// 🌟 核心定义：本地母舰节点的静态 ID
export const HOME_NODE_ID = "local-home-station";

/**
 * StoreNode (原 NodeConfig)
 * 这里的策略是：Store 专用的结构 = 基础数据 (BaseNodeData) + 位置/ID信息
 */
export interface StoreNode {
  id: string;
  category: NodeCategory;
  position: { x: number; y: number };

  // 👇 下面这些字段直接复用 BaseNodeData 的定义，确保和 React Flow 渲染层完全一致
  name: string;
  // 🌟 关键修复：直接使用 BaseNodeData['status']
  // 等同于: "online" | "offline" | "error" | "connecting"
  status: BaseNodeData["status"];
  description?: string;
  ip?: string; // 远程服务器需要 IP，类型定义里有，Store 里也得有
}

interface NodeState {
  nodes: StoreNode[];
  activeNodeId: string | null;

  // Actions
  addNode: (category: NodeCategory) => void;
  removeNode: (id: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  enterNode: (id: string) => void;
  exitNode: () => void;
}

// 🌟 初始化状态
const INITIAL_NODES: StoreNode[] = [
  {
    id: HOME_NODE_ID,
    category: NODE_CATEGORIES.HOME,
    name: NODE_CONFIG[NODE_CATEGORIES.HOME].defaultName,
    // 🌟 修复：必须使用 types/nodes.ts 里定义的合法值 ("connected" -> "online")
    status: "online",
    position: { x: 0, y: 0 },
    description: "Primary Control Station",
  },
];

export const NodeStore = create<NodeState>((set, get) => ({
  nodes: INITIAL_NODES,
  activeNodeId: null,

  addNode: (category) => {
    const config = NODE_CONFIG[category];

    // 单例拦截
    if (category === NODE_CATEGORIES.HOME) {
      return get().enterNode(HOME_NODE_ID);
    }

    // 创建新节点
    const newNode: StoreNode = {
      id: crypto.randomUUID(),
      category,
      name: config.defaultName,
      // 🌟 修复：默认状态设为 "offline" (对应之前的 disconnected)
      status: "offline",
      position: {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 + 100,
      },
      // 如果是远程节点，可以预留 ip 字段
      ip: category === NODE_CATEGORIES.REMOTE ? "127.0.0.1" : undefined,
    };

    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => {
        if (n.id === id) return NODE_CONFIG[n.category].allowDelete;
        return true;
      }),
    })),

  updateNodePosition: (id, pos) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, position: pos } : n,
      ),
    })),

  enterNode: (id) => set({ activeNodeId: id }),
  exitNode: () => set({ activeNodeId: null }),
}));
