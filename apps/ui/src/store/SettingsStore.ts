import { create } from 'zustand';

// 根据你的 navigation.ts 定义，我们将设置选项卡分为这 5 类
export type SettingsTab = 
  | 'general'    // 🛡️ 通用 (主题, 语言, 版本信息)
  | 'scispirit'  // 🤖 Spirit: AI/LLM 设置 (原先的 'llm')
  | 'sciscript'  // 👨‍💻 Script: 编辑器偏好 (字体, 补全)
  | 'scicomb'    // ⬡ Comb: 数据处理流设置
  | 'scicellar'; // 🛖 Cellar: 连接与存储 (原先的 'ssh')

interface SettingsState {
  isOpen: boolean;
  activeTab: SettingsTab;

  // 打开设置 (可传入目标 Tab 实现自动跳转)
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
  setTab: (tab: SettingsTab) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isOpen: false,
  activeTab: 'general', // 默认进通用

  openSettings: (tab) =>
    set(() => ({
      isOpen: true,
      // 如果没传 tab，默认去 general；传了就去对应的模块设置
      activeTab: tab || 'general',
    })),

  closeSettings: () => set({ isOpen: false }),

  setTab: (tab) => set({ activeTab: tab }),
}));