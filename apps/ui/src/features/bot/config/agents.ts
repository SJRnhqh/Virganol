// apps/ui/src/features/bot/config/agents.ts
import { 
  FlaskConical, 
  BookOpenText, 
  type LucideIcon 
} from "lucide-react";

export type AgentType = 'ester' | 'kiral';

export interface AgentConfig {
  id: AgentType;
  name: string;
  role: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  placeholder: string;
  activeDot: string;
}

export const AGENTS: Record<AgentType, AgentConfig> = {
  ester: {
    id: 'ester',
    name: "Ester",
    role: "Research Copilot",
    icon: BookOpenText,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "hover:border-amber-200",
    placeholder: "Ask Ester to summarize PDFs, draft SI, or chat...",
    activeDot: "bg-amber-400"
  },
  kiral: {
    id: 'kiral',
    name: "Kiral",
    role: "Lab Assistant",
    icon: FlaskConical,
    color: "text-[#315f4d]",
    bgColor: "bg-[#f0f5e5]/50",
    borderColor: "hover:border-[#83a78d]/20",
    placeholder: "Ask Kiral to log an experiment entry...",
    activeDot: "bg-[#8cc269]"
  }
};