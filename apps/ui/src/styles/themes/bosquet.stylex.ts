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
    tonic: vine.songshuanglv,
    dominant: vine.danmifen,
    anchor: vine.qinghui,
    tether: vine.white, // Placeholder for future connection lines.
    buoy: vine.xiayunhui,
    undertone: vine.danlvhui,
    prelude: vine.danhuilv,
    interlude: vine.shuilv,
    coda: vine.xiangyehong,
  },
  dark: {
    tonic: pine.songlv,
    dominant: pine.hehui,
    anchor: pine.xuebai,
    tether: pine.white, // Placeholder for future connection lines.
    buoy: pine.xingzihui,
    undertone: pine.wasonglv,
    prelude: pine.caohuilv,
    interlude: pine.helv,
    coda: pine.shuangyehong,
  },
});
