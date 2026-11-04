// apps/ui/src/lib/platform.ts

/** Host platform is macOS.
 *
 * 宿主平台为 macOS。
 */
export const isMac = detectPlatform() === "macos";

/** Host platform is Windows.
 *
 * 宿主平台为 Windows。
 */
export const isWindows = detectPlatform() === "windows";

/** Host platform of the application.
 *
 * 应用的宿主平台。
 */
function detectPlatform(): "linux" | "macos" | "unknown" | "windows" {
  const ua = navigator.userAgent;
  if (ua.includes("Linux") && !ua.includes("Android")) return "linux";
  if (ua.includes("Macintosh")) return "macos";
  if (ua.includes("Windows")) return "windows";
  return "unknown";
}
