// apps/ui/src/config/navigation.ts
import {
  Bot, // 🤖 Spirit: AI 灵魂
  ScrollText, // 👨‍💻 Formula: 代码配方 (IDE)
  Hexagon, // ⬡ Comb: 蜂巢数据
  // FlaskConical, // ⚗️ Mead: 酿造模型
  Warehouse, // 🛖 Cellar: 资产地窖
  // Network, // 🌐 Apiary: 蜂场拓扑
  // Beer, // 🍺 Bar: 插件酒馆 (社区集市)
  type LucideIcon,
} from "lucide-react";

export interface NavItemConfig {
  id: string;
  label: string; // UI显示名 (简短有力)
  fullName?: string; // Tooltip全名 (V.I.N.E. 家族名)
  icon: LucideIcon;
  description?: string;
}

export const NAV_ITEMS: NavItemConfig[] = [
  // --- High Frequency: Interaction & Creation (高频区：交互与创造) ---
  {
    id: "scispirit", // 建议统一 ID 前缀，方便代码全局搜索
    label: "Spirit",
    fullName: "SciSpirit",
    icon: Bot,
    description: "AI Assistant & Robots",
  },
  {
    id: "sciscript",
    label: "Script",
    fullName: "SciScript",
    icon: ScrollText,
    description: "Code Editor & Notebook",
  },

  // --- Core Workflow: Production (核心区：生产流水线) ---
  {
    id: "scicomb",
    label: "Comb",
    fullName: "SciComb",
    icon: Hexagon,
    description: "Data Refinery & Processing Workflow",
  },
  // {
  //   id: "scimead",
  //   label: "Mead",
  //   fullName: "SciMead",
  //   icon: FlaskConical,
  //   description: "Model Training & Evaluation Workflow",
  // },

  // --- Support: Storage & Infra (支撑区：存储与基建) ---
  {
    id: "scicellar",
    label: "Cellar",
    fullName: "SciCellar",
    icon: Warehouse,
    description: "Asset Vault & Storage",
  },
  // {
  //   id: "sciapiary",
  //   label: "Apiary",
  //   fullName: "SciApiary",
  //   icon: Network,
  //   description: "Computing Cluster & Nodes",
  // },

  // --- External: Community (外部区：社区) ---
  // {
  //   id: "scibar",
  //   label: "Bar",
  //   fullName: "SciBar",
  //   icon: Beer,
  //   description: "Plugin, Dataset, Model, Agent Marketplace",
  // },
];
