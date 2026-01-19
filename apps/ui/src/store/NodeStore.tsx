import { create } from "zustand";
import { NODE_CONFIG, NODE_CATEGORIES, type NodeCategory } from "@/config/node";

// 🌟 核心定义：本地母舰节点的静态 ID，方便全局索引
export const HOME_NODE_ID = "local-home-station";

export interface NodeConfig {
  id: string;
  category: NodeCategory;
  name: string;
  status: "disconnected" | "connected" | "error";
  position: { x: number; y: number };
  description?: string; // 用于展示本地硬件摘要
}

interface NodeState {
  nodes: NodeConfig[];
  activeNodeId: string | null;

  // Actions
  addNode: (category: NodeCategory) => void;
  removeNode: (id: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  enterNode: (id: string) => void;
  exitNode: () => void;
}

// 🌟 初始化状态：默认包含一个本地节点
const INITIAL_NODES: NodeConfig[] = [
  {
    id: HOME_NODE_ID,
    category: NODE_CATEGORIES.HOME, // 这里决定了它在 Canvas 里会被映射为 HomeNode
    name: NODE_CONFIG[NODE_CATEGORIES.HOME].defaultName,
    status: "connected", // 本地节点永远在线
    position: { x: 0, y: 0 }, // 默认居中
    description: "Primary Control Station",
  },
];

export const NodeStore = create<NodeState>((set, get) => ({
  nodes: INITIAL_NODES,
  activeNodeId: null,

  addNode: (category) => {
    const config = NODE_CONFIG[category];

    // 单例拦截：如果是 HOME 类型，直接跳转，绝不重复创建
    if (category === NODE_CATEGORIES.HOME) {
      return get().enterNode(HOME_NODE_ID);
    }

    // 其他节点的创建逻辑
    const newNode: NodeConfig = {
      id: crypto.randomUUID(),
      category,
      name: config.defaultName,
      status: "disconnected",
      position: {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 + 100,
      },
    };

    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => {
        // 保护 HOME 节点不被删除
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
