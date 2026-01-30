import { Settings2, type LucideIcon } from "lucide-react";
import { NAV_ITEMS } from "./navigation";
import { type SettingsTab } from "../store/SettingsStore";

// 定义面板类型
export type PanelType = "general" | "spirit" | "comingSoon";

// 定义设置菜单项的接口
export interface SettingsTabItem {
  id: SettingsTab;
  label: string;
  icon: LucideIcon;
  // 面板类型：决定渲染哪个面板组件
  panelType: PanelType;
  // 面板显示名称（用于 ComingSoonPanel）
  panelDisplayName?: string;
}

// 1. 定义静态的通用设置项
const STATIC_TABS: SettingsTabItem[] = [
  {
    id: "general",
    label: "General",
    icon: Settings2,
    panelType: "general",
    panelDisplayName: "General Settings",
  },
];

// 2. 动态生成模块设置项
// 从 NAV_ITEMS 中提取信息，自动生成 Spirit, Script, Comb 等设置入口
const MODULE_TABS: SettingsTabItem[] = NAV_ITEMS.map((item) => ({
  id: item.id as SettingsTab, // 确保 ID 类型匹配
  label: item.label, // 复用导航栏的短名称 (e.g., "Spirit")
  icon: item.icon, // 复用导航栏的图标
  // 根据 ID 决定面板类型
  panelType: item.id === "scispirit" ? "spirit" : "comingSoon",
  // ComingSoon 面板的显示名称
  panelDisplayName: item.label,
}));

// 3. 合并导出
export const SETTINGS_TABS: SettingsTabItem[] = [
  ...STATIC_TABS,
  ...MODULE_TABS,
];