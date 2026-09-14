// apps/ui/src/types/settings.ts

// Settings Tab 的唯一 ID 列表（单一事实来源）
const SETTINGS_TAB_IDS = [
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
