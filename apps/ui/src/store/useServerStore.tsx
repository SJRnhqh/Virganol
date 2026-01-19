import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { NODE_CONFIG, NODE_CATEGORIES, type NodeCategory } from "@/config/node";

export interface ServerConfig {
  id: string;
  category: NodeCategory; // 🌟 核心：节点类型
  name: string;
  host: string;
  port: string;
  username: string;
  password?: string;
  status: "disconnected" | "connecting" | "connected" | "error";
  errorMessage?: string;
  position: { x: number; y: number };
}

interface ServerState {
  servers: ServerConfig[];
  isSettingsOpen: boolean;
  activeNodeId: string | null;

  toggleSettings: (isOpen: boolean) => void;

  // 🌟 统一的添加/激活方法
  addNode: (category: NodeCategory, data?: Partial<ServerConfig>) => void;
  removeNode: (id: string) => void;

  updateServerPosition: (
    id: string,
    position: { x: number; y: number },
  ) => void;
  testConnection: (server: Partial<ServerConfig>) => Promise<boolean>;

  enterNode: (id: string) => void;
  exitNode: () => void;
}

export const useServerStore = create<ServerState>((set, get) => ({
  servers: [],
  isSettingsOpen: false,
  activeNodeId: null,

  toggleSettings: (isOpen) => set({ isSettingsOpen: isOpen }),

  /**
   * 🌟 智能添加节点
   * 如果是 HOME 类型且已存在，则直接进入(Focus)该节点，不再重复创建
   */
  addNode: (category, data = {}) => {
    const config = NODE_CONFIG[category];
    const existingNodes = get().servers.filter((s) => s.category === category);

    // 1. 检查数量限制
    if (existingNodes.length >= config.maxCount) {
      if (category === NODE_CATEGORIES.HOME && existingNodes[0]) {
        // 如果本地节点已存在，直接进入
        get().enterNode(existingNodes[0].id);
        return;
      }
      console.warn(`Limit reached for ${category}`);
      return;
    }

    // 2. 创建新节点
    const newNode: ServerConfig = {
      id: crypto.randomUUID(),
      category,
      name: data.name || config.defaultName,
      host: data.host || "",
      port: data.port || "22",
      username: data.username || "",
      password: data.password || "",
      status: "disconnected",
      // 初始位置稍微偏移，避免完全重叠
      position: {
        x: Math.random() * 100 + 100,
        y: Math.random() * 100 + 100,
      },
    };

    set((state) => ({ servers: [...state.servers, newNode] }));

    // 3. 如果是本地节点，创建后自动进入
    if (category === NODE_CATEGORIES.HOME) {
      get().enterNode(newNode.id);
    }
  },

  removeNode: (id) =>
    set((state) => ({
      // 检查配置是否允许删除
      servers: state.servers.filter((s) => {
        if (s.id === id) return NODE_CONFIG[s.category].allowDelete;
        return true;
      }),
    })),

  updateServerPosition: (id, pos) =>
    set((state) => ({
      servers: state.servers.map((s) =>
        s.id === id ? { ...s, position: pos } : s,
      ),
    })),

  testConnection: async (config) => {
    try {
      await invoke("test_ssh_params", {
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
      });
      return true;
    } catch (e) {
      console.error("Connection failed:", e);
      return false;
    }
  },

  enterNode: (id) => set({ activeNodeId: id }),
  exitNode: () => set({ activeNodeId: null }),
}));
