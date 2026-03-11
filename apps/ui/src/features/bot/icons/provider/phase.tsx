// apps/ui/src/features/bot/icons/provider/phase.tsx
// 外部依赖
import {
  Cloud,
  CloudCog,
  CloudCheck,
  CloudAlert,
  CloudOff,
} from "lucide-react";

// 内部引用
import type { ProviderCheckPhase } from "@/features/bot/types";

/** 生命周期阶段对应的 Cloud 图标映射 */
export const PHASE_CLOUD_ICONS: Record<
  ProviderCheckPhase,
  React.ComponentType<{ className?: string }>
> = {
  idle: Cloud,
  checking: CloudCog,
  done: CloudCheck,
  degraded: CloudAlert,
  failed: CloudOff,
};
