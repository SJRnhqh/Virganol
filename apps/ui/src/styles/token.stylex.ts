// apps/ui/src/styles/token.stylex.ts
import { defineVars } from "@stylexjs/stylex";

import { bosquet } from "./themes/bosquet.stylex";

/** Semantic color tokens of the application.
 *
 * 应用的语义颜色令牌。
 */
export const colorTokens = defineVars({
  headerBg: bosquet.light.dominant,
  headerIcon: bosquet.light.buoy,
  headerIconHover: bosquet.light.anchor,
});
