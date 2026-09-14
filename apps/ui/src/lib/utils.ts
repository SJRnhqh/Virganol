// apps/ui/src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combines conditional class names and resolves Tailwind CSS conflicts.
 *
 * 合并条件类名并解决工具类冲突。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
