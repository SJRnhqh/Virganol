// apps/ui/src/lib/platform.ts
import { type } from "@tauri-apps/plugin-os";

/** Host platform is macOS.
 *
 * 宿主平台为 macOS。
 */
export const isMac = hostPlatform() === "macos";

/** Host platform is Windows.
 *
 * 宿主平台为 Windows。
 */
export const isWindows = hostPlatform() === "windows";

/** Host platform reported by the Tauri runtime.
 *
 * 由 Tauri 运行时报告的宿主平台。
 */
function hostPlatform() {
  try {
    return type();
  } catch {
    return "unknown";
  }
}
