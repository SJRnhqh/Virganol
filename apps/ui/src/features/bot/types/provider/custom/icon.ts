// apps/ui/src/features/bot/types/provider/custom/icon.ts
// 外部依赖
import type { LucideIcon } from "lucide-react";

/** 图标槽位结构（统一管理图标组件与额外样式） */
export interface IconSlot {
  /** 图标组件 */
  icon: LucideIcon;
  /** 图标额外样式 */
  className?: string;
}
