// apps/ui/src/styles/token.stylex.ts
import { defineVars } from "@stylexjs/stylex";

/** Colors of the vine theme.
 *
 * vine 主题的配色。
 */
const vine = {
  songshuanglv: "#83a78d",
} as const;

/** Semantic color tokens of the application.
 *
 * 应用的语义颜色令牌。
 */
export const colorTokens = defineVars({
  headerBg: vine.songshuanglv,
});
