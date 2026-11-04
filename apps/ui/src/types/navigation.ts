// apps/ui/src/types/navigation.ts
import type { LucideIcon } from "lucide-react";

/** Presentation config of a workbench navigation item.
 *
 * 工作台导航项的展示配置。
 */
export interface NavItemConfig {
  /** The navigation item identifier.
   *
   * 导航项标识。
   */
  id: NavId;
  /** Display label.
   *
   * 显示名。
   */
  label: string;
  /** Full name shown in the tooltip.
   *
   * Tooltip 中显示的完整名。
   *
   * TODO: No consumer yet; keep or drop.
   *
   * TODO：暂无消费方，去留待定。
   */
  fullName?: string;
  /** Displayed icon.
   *
   * 显示图标。
   */
  icon: LucideIcon;
  /** Item description.
   *
   * 条目描述。
   *
   * TODO: No consumer yet; keep or drop.
   *
   * TODO：暂无消费方，去留待定。
   */
  description?: string;
}

/** Workbench navigation item identifier.
 *
 * 工作台导航项标识。
 */
export type NavId =
  | "scispirit"
  | "sciscript"
  | "scicomb"
  | "scimead"
  | "scicellar"
  | "sciapiary"
  | "scibar";
