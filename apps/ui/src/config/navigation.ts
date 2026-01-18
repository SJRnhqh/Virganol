import {
  Bot,
  Workflow,
  Library,
  CodeXml,
  Network,
  BrainCircuit,
  Database,
  Store,
  type LucideIcon,
} from "lucide-react";

export type NavGroup = "logic" | "infra" | "assets";

export interface NavItemConfig {
  id: string;
  icon: LucideIcon;
  label: string;
  group: NavGroup;
}

export const NAV_ITEMS: NavItemConfig[] = [
  // 核心交互与记忆
  { id: "bot", icon: Bot, label: "Bot Deck", group: "logic" },
  { id: "workflow", icon: Workflow, label: "Workflow Deck", group: "logic" },
  { id: "vault", icon: Library, label: "Vault Deck", group: "logic" },

  // 节点实验室
  { id: "nodes", icon: Network, label: "Node Deck", group: "infra" },
  { id: "code", icon: CodeXml, label: "Code Deck", group: "infra" }, // Code 也可以看作一种基础设施

  // 静态资产
  { id: "models", icon: BrainCircuit, label: "Model Deck", group: "assets" },
  { id: "datasets", icon: Database, label: "Dataset Deck", group: "assets" },
  { id: "hub", icon: Store, label: "Hub Deck", group: "assets" }, // 新增：插件生态
];

export const NAV_DIMENSIONS = {
  ITEM_HEIGHT: 40, // 对应 w-10
  ITEM_MARGIN: 12, // 对应 mb-3
  INDICATOR_OFFSET: 10, // 用于对齐图标中心 (40/2 - 5/2 等逻辑)
};

export const NAV_THEME = {
  // 1.0 为正常大小
  IDLE_SCALE: "scale-120",

  // 🔴 关键：直接定义 group-hover 类名，解决 Hover 无效问题
  HOVER_SCALE: "group-hover:scale-[1.25]", // 1.5倍太大会模糊，推荐 1.25
  HOVER_OPACITY: "group-hover:opacity-100",

  ACTIVE_SCALE: "scale-130",

  // 🔴 关键：确保 ease 语法被正确包裹在 ease-[...] 中
  TRANSITION:
    "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",

  OPACITY_IDLE: "opacity-60",
  OPACITY_ACTIVE: "opacity-100",
};
