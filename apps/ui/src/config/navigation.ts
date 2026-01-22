import {
  Bot, // Bot Deck
  Workflow, // Workflow Deck
  Library, // Vault Deck (Database or Library)
  Network, // Node Deck (Old SSH)
  CodeXml, // Code Deck
  Store, // Hub Deck
  Hexagon, // 🐝 SciComb (Data Deck) - 核心改动
  FlaskConical, // 🍷 SciMead (Model Deck) - 核心改动
  type LucideIcon,
} from "lucide-react";

// 扩展接口，加入路由、快捷键和描述
export interface NavItemConfig {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string; // 必须：用于路由跳转
  shortcut?: string; // 推荐：生产力工具标配
  description?: string; // 推荐：用于 Tooltip 显示 "Data Refinery" 等解释
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "bot",
    icon: Bot,
    label: "Bot Deck",
    path: "/bot",
    shortcut: "⌘+1",
  },
  {
    id: "scicomb",
    icon: Hexagon,
    label: "SciComb", // ⚡️ 品牌化命名
    path: "/scicomb", // 路由对应
    shortcut: "⌘+2",
    description: "Data Refinery & Flow", // 辅助说明：数据提炼
  },
  {
    id: "scimead",
    icon: FlaskConical, // ⚗️ 烧瓶代替了大脑，呼应“酿造”
    label: "SciMead", // ⚡️ 品牌化命名
    path: "/scimead",
    shortcut: "⌘+3",
    description: "Model Distillation", // 辅助说明：模型蒸馏
  },
  {
    id: "workflow",
    icon: Workflow,
    label: "Workflow",
    path: "/workflow",
    shortcut: "⌘+4",
  },
  {
    id: "vault",
    icon: Library,
    label: "Vault",
    path: "/vault",
    shortcut: "⌘+5",
  },
  {
    id: "code",
    icon: CodeXml,
    label: "Code",
    path: "/code",
    shortcut: "⌘+6",
  },
  {
    id: "nodes",
    icon: Network,
    label: "Nodes",
    path: "/nodes",
    shortcut: "⌘+7",
  },
  {
    id: "hub",
    icon: Store,
    label: "Hub",
    path: "/hub",
    shortcut: "⌘+8",
  },
];

// 样式配置保持不变，非常完美
export const NAV_DIMENSIONS = {
  ITEM_HEIGHT: 40,
  ITEM_MARGIN: 12,
  INDICATOR_OFFSET: 10,
};

export const NAV_THEME = {
  IDLE_SCALE: "scale-120",
  HOVER_SCALE: "group-hover:scale-[1.25]",
  HOVER_OPACITY: "group-hover:opacity-100",
  ACTIVE_SCALE: "scale-130",
  TRANSITION:
    "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  OPACITY_IDLE: "opacity-60",
  OPACITY_ACTIVE: "opacity-100",
};
