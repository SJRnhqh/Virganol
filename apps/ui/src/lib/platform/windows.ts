// apps/ui/src/lib/platform/windows.ts
import { hostPlatform } from "./host";

/** Host platform is Windows.
 *
 * 宿主平台为 Windows。
 */
export const isWindows = hostPlatform() === "windows";
