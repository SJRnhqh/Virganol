import { create } from "zustand";

export interface TerminalSession {
  nodeId: string;
  name: string;
  status: "connected" | "disconnected";
}

interface TerminalState {
  isOpen: boolean;
  isMaximized: boolean;
  activeSessionId: string | null;
  sessions: TerminalSession[];

  openTerminal: (nodeId: string, name: string) => void;
  closeTerminal: (nodeId: string) => void;
  toggleMaximize: () => void;
  minimize: () => void;
  switchSession: (nodeId: string) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  isOpen: false,
  isMaximized: false,
  activeSessionId: null,
  sessions: [],

  openTerminal: (nodeId, name) => {
    const { sessions } = get();
    // 如果 Tab 已存在，直接切换过去
    if (sessions.some((s) => s.nodeId === nodeId)) {
      set({ isOpen: true, activeSessionId: nodeId });
      return;
    }
    // 不存在则创建
    const newSession: TerminalSession = { nodeId, name, status: "connected" };
    set({
      isOpen: true,
      activeSessionId: nodeId,
      sessions: [...sessions, newSession],
    });
  },

  closeTerminal: (nodeId) =>
    set((state) => {
      const newSessions = state.sessions.filter((s) => s.nodeId !== nodeId);
      // 关闭当前 Tab 后，尝试切换到前一个
      const newActive =
        state.activeSessionId === nodeId
          ? newSessions.length > 0
            ? newSessions[newSessions.length - 1].nodeId
            : null
          : state.activeSessionId;

      return {
        sessions: newSessions,
        activeSessionId: newActive,
        isOpen: newSessions.length > 0, // 没 Tab 了就自动关窗
      };
    }),

  switchSession: (id) => set({ activeSessionId: id }),
  toggleMaximize: () => set((state) => ({ isMaximized: !state.isMaximized })),
  minimize: () => set({ isOpen: false }),
}));
