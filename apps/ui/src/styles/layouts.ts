// apps/ui/src/styles/layouts.ts
import { create } from "@stylexjs/stylex";

/** Shell layout styles of the application.
 *
 * 应用的外壳布局样式。
 */
export const mainLayoutStyles = create({
  root: {
    overflow: "hidden",
    backgroundColor: "var(--main-bg)",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
  },
  workspace: {
    flex: "1",
    overflow: "hidden",
    display: "flex",
    position: "relative",
    height: "100%",
    width: "100%",
  },
  workspaceRight: {
    flexDirection: "row-reverse",
  },
});
