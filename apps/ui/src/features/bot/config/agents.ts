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
  placeholder: string;
}

export const AGENTS: Record<AgentType, AgentConfig> = {
  ester: {
    id: 'ester',
    name: "Ester",
    role: "Research Copilot",
    icon: BookOpenText,
    color: "text-spirit-botinput-ester",
    placeholder: "Ask Ester to summarize PDFs, draft SI, or chat..."
  },
  kiral: {
    id: 'kiral',
    name: "Kiral",
    role: "Lab Assistant",
    icon: FlaskConical,
    color: "text-spirit-botinput-kiral",
    placeholder: "Ask Kiral to log an experiment entry..."
  }
};