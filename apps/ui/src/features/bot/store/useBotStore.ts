// apps/ui/src/features/bot/store/useBotStore.ts
import { create } from "zustand";

// =========================================
// 1. 基础类型定义 (Primitives)
// =========================================

// 极简的 Artifact 定义
export interface Artifact {
  id: string;
  type: "pdf" | "code" | "molecule"; // 目前只定义这三种核心
  title: string;
  data: string; // 这是一个万能字段：存 PDF URL, 代码字符串, 或 SMILES 分子式
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

// =========================================
// 2. Store 状态定义 (State & Actions)
// =========================================

interface BotState {
  // --- State (数据) ---
  
  // 视图模式：Solo (纯聊) vs Split (工坊)
  viewMode: "solo" | "split";
  
  // 当前激活的工坊产物 (右侧显示的内容)
  activeArtifact: Artifact | null;

  // 对话列表
  messages: ChatMessage[];
  
  // 是否正在生成 (打字机效果中)
  isStreaming: boolean;

  // --- Actions (操作/方法) ---
  
  // 切换视图模式
  setViewMode: (mode: "solo" | "split") => void;
  
  // 打开某个产物 (会自动切换到 split 模式)
  openArtifact: (artifact: Artifact) => void;
  
  // 关闭产物 (回到 solo 模式)
  closeArtifact: () => void;
  
  // 发送消息 (暂时的 Mock 方法)
  addMessage: (msg: ChatMessage) => void;
  setStreaming: (isStreaming: boolean) => void;
}

// =========================================
// 3. Store 实现 (Implementation)
// =========================================

export const useBotStore = create<BotState>((set) => ({
  // 初始状态
  viewMode: "solo",
  activeArtifact: null,
  messages: [],
  isStreaming: false,

  // 方法实现
  setViewMode: (mode) => set({ viewMode: mode }),

  openArtifact: (artifact) => set({ 
    activeArtifact: artifact, 
    viewMode: "split" // 打开产物时，强制进入分屏模式
  }),

  closeArtifact: () => set({ 
    activeArtifact: null, 
    viewMode: "solo" // 关闭产物时，自动回到单人模式 (可选，看交互喜好)
  }),

  addMessage: (msg) => set((state) => ({ 
    messages: [...state.messages, msg] 
  })),

  setStreaming: (isStreaming) => set({ isStreaming }),
}));