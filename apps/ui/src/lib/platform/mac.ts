// apps/ui/src/lib/platform/mac.ts
import { hostPlatform, hostVersion } from "./host";

/** Host platform is macOS.
 *
 * 宿主平台为 macOS。
 */
export const isMac = hostPlatform() === "macos";

/** Host platform is macOS 26 (Tahoe) or newer.
 *
 * 宿主平台为 macOS 26（Tahoe）或更新版本。
 */
export const isTahoeOrNewer = isMac && Number.parseInt(hostVersion(), 10) >= 26;
