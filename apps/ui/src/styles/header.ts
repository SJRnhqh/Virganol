// apps/ui/src/styles/header.ts
import { create } from "@stylexjs/stylex";

/** Window header styles of the application.
 *
 * 应用的窗口顶栏样式。
 */
export const windowHeaderStyles = create({
  root: {
    borderStyle: "solid",
    borderWidth: 0,
    paddingInline: "0.75rem",
    alignItems: "flex-end",
    backgroundColor: "var(--header-bg)",
    cursor: "default",
    display: "flex",
    flexShrink: 0,
    isolation: "isolate",
    position: "relative",
    userSelect: "none",
    zIndex: 9999,
    borderBottomColor: "var(--sidebar-border)",
    borderBottomWidth: "1px",
    height: "1.75rem",
  },
  trafficLightInset: {
    paddingInlineStart: "5rem",
  },
  breadcrumbWrap: {
    zIndex: 10,
    height: "100%",
  },
  controls: {
    gap: "0.25rem",
    alignItems: "center",
    display: "flex",
    height: "100%",
    marginBottom: "0.125rem",
    marginLeft: "auto",
    marginRight: "0.25rem",
  },
  controlsWindows: {
    marginRight: "6.5rem",
  },
});
