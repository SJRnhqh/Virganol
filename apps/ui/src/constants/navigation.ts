// apps/ui/src/constants/navigation.ts
import {
  Beer,
  Bot,
  FlaskConical,
  Hexagon,
  Network,
  ScrollText,
  Warehouse,
} from "lucide-react";

import type { NavItemConfig } from "@/types";

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
  {
    id: "scimead",
    label: "Mead",
    fullName: "SciMead",
    icon: FlaskConical,
    description: "Model Training & Evaluation Workflow",
  },

  // --- Support: Storage & Infra (支撑区：存储与基建) ---
  {
    id: "scicellar",
    label: "Cellar",
    fullName: "SciCellar",
    icon: Warehouse,
    description: "Asset Vault & Storage",
  },

  {
    id: "sciapiary",
    label: "Apiary",
    fullName: "SciApiary",
    icon: Network,
    description: "Computing Cluster & Nodes",
  },

  // --- External: Community (外部区：社区) ---
  {
    id: "scibar",
    label: "Bar",
    fullName: "SciBar",
    icon: Beer,
    description: "Plugin, Dataset, Model, Agent Marketplace",
  },
];
