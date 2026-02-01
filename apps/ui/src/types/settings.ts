// apps/ui/src/types/settings.ts
// 说明：
// - 这里是 Settings 的“类型与基础常量”来源，供 store/constants 共用
// - 避免 store 反向成为常量来源，减少依赖倒置

// Settings Tab 的唯一 ID 列表（单一事实来源）
export const SETTINGS_TAB_IDS = [
  "general",
  "scispirit",
  "sciscript",
  "scicomb",
  "scicellar",
] as const;

// 根据 ID 列表派生出类型（自动跟随）
export type SettingsTab = (typeof SETTINGS_TAB_IDS)[number];

// 默认打开的 Tab
export const DEFAULT_SETTINGS_TAB: SettingsTab = SETTINGS_TAB_IDS[0];
