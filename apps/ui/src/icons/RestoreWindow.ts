// apps/ui/src/icons/RestoreWindow.ts
import { createLucideIcon } from "lucide-react";

/** Window restore icon.
 *
 * 窗口还原图标。
 */
export const RestoreWindow = createLucideIcon("restore-window", [
  ["path", { d: "M8 3h11a2 2 0 0 1 2 2v11", key: "back-window" }],
  ["rect", { x: "3", y: "7", width: "14", height: "14", rx: "2", key: "front-window" }],
]);
