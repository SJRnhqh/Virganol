// apps/ui/src/lib/platform/host.ts
import { type, version } from "@tauri-apps/plugin-os";

/** Host platform reported by the Tauri runtime.
 *
 * 由 Tauri 运行时报告的宿主平台。
 */
export function hostPlatform() {
  try {
    return type();
  } catch {
    return "unknown";
  }
}

/** Host platform version reported by the Tauri runtime.
 *
 * 由 Tauri 运行时报告的宿主平台版本。
 */
export function hostVersion() {
  try {
    return version();
  } catch {
    return "";
  }
}
