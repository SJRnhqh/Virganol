import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

export interface ServerConfig {
  id: string;
  name: string;
  host: string;
  port: string;
  username: string;
  password?: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  errorMessage?: string;
  position: { x: number; y: number };
}

interface ServerState {
  servers: ServerConfig[];
  isSettingsOpen: boolean;
  activeNodeId: string | null; // 🌟 新增：当前激活(进入)的节点 ID

  toggleSettings: (isOpen: boolean) => void;
  addServer: (server: Omit<ServerConfig, 'id' | 'status' | 'position'>) => void;
  updateServerPosition: (id: string, position: { x: number; y: number }) => void;
  testConnection: (server: Partial<ServerConfig>) => Promise<boolean>;
  
  // 🌟 新增动作：进入/退出节点
  enterNode: (id: string) => void;
  exitNode: () => void;
}

export const useServerStore = create<ServerState>((set) => ({
  servers: [], 
  isSettingsOpen: false,
  activeNodeId: null, // 默认在沙盘模式 (null)

  toggleSettings: (isOpen) => set({ isSettingsOpen: isOpen }),

  addServer: (serverData) => set((state) => ({
    servers: [
      ...state.servers,
      {
        ...serverData,
        id: crypto.randomUUID(),
        status: 'disconnected',
        position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 }
      }
    ]
  })),

  updateServerPosition: (id, pos) => set((state) => ({
    servers: state.servers.map(s => 
      s.id === id ? { ...s, position: pos } : s
    )
  })),

  testConnection: async (config) => {
    try {
      console.log('Testing connection to:', config.host);
      await invoke("test_ssh_params", {
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password
      });
      return true;
    } catch (e) {
      console.error('Connection failed:', e);
      return false;
    }
  },

  // 🌟 实现进入/退出逻辑
  enterNode: (id) => set({ activeNodeId: id }),
  exitNode: () => set({ activeNodeId: null }),
}));