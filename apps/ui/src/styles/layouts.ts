// apps/ui/src/styles/layouts.ts
import { create } from "@stylexjs/stylex";

import { colorTokens } from "./token.stylex";

/** Shell layout styles of the application.
 *
 * 应用的外壳布局样式。
 */
export const mainLayoutStyles = create({
  root: {
    backgroundColor: colorTokens.bg,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  workspace: {
    flex: "1",
    display: "flex",
  },
  workspaceMirrored: {
    flexDirection: "row-reverse",
  },
});
