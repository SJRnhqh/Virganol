// apps/ui/src/styles/token.stylex.ts
import { defineVars } from "@stylexjs/stylex";

import { bosquet } from "./themes/bosquet.stylex";

/** Semantic color tokens of the application.
 *
 * 应用的语义颜色令牌。
 */
export const colorTokens = defineVars({
  bg: bosquet.light.dominant,
  headerBg: bosquet.light.tonic,
  headerIcon: bosquet.light.buoy,
  headerIconHover: bosquet.light.anchor,
  headerIconHoverBg: bosquet.light.undertone,
  windowMinimizeHoverBg: bosquet.light.prelude,
  windowToggleMaximizeHoverBg: bosquet.light.interlude,
  windowCloseHoverBg: bosquet.light.coda,
});
