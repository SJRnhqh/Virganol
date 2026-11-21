// apps/ui/src/styles/themes/bosquet.stylex.ts
import { unstable_defineVarsNested } from "@stylexjs/stylex";

import { pine } from "../palettes/pine.stylex";
import { vine } from "../palettes/vine.stylex";

/** Bosquet theme.
 *
 * Bosquet 主题。
 */
export const bosquet = unstable_defineVarsNested({
  light: {
    dominant: vine.songshuanglv,
    anchor: vine.qinghui,
    tether: vine.white, // Placeholder for future connection lines.
    buoy: vine.xiayunhui,
  },
  dark: { dominant: pine.yunshanlv },
});
