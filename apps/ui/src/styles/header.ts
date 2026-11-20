// apps/ui/src/styles/header.ts
import { create } from "@stylexjs/stylex";

import { colorTokens } from "./token.stylex";

/** Window header styles of the application.
 *
 * 应用的窗口顶栏样式。
 */
export const windowHeaderStyles = create({
  root: {
    paddingInline: "0.75rem",
    alignItems: "center",
    backgroundColor: colorTokens.headerBg,
    cursor: "default",
    display: "flex",
    flexShrink: 0,
    isolation: "isolate",
    userSelect: "none",
    zIndex: 9999, // Revisit stacking during the header redesign.
    height: "2rem",
  },
  preTahoeHeight: {
    height: "1.75rem",
  },
  trafficLightInset: {
    paddingInlineStart: "5rem",
  },
  windowsRoot: {
    paddingInlineEnd: 0,
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
    marginLeft: "auto",
    marginRight: "0.25rem",
  },
});

/** Window control styles of the application.
 *
 * 应用的窗口控制按钮组样式。
 */
export const windowControlsStyles = create({
  root: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    height: "100%",
  },
  button: {
    borderRadius: "0.375rem",
    alignItems: "center",
    color: {
      default: "var(--header-icon-muted)",
      ":hover": {
        default: null,
        "@media (hover: hover)": "var(--header-icon)",
      },
    },
    display: "flex",
    justifyContent: "center",
    transitionDuration: "200ms",
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    height: "2rem",
    width: "2.5rem",
  },
  minimizeButton: {
    backgroundColor: {
      default: null,
      ":hover": {
        default: null,
        "@media (hover: hover)": "var(--window-control-minimize)",
      },
    },
  },
  maximizeButton: {
    backgroundColor: {
      default: null,
      ":hover": {
        default: null,
        "@media (hover: hover)": "var(--window-control-toggle-maximize)",
      },
    },
  },
  closeButton: {
    backgroundColor: {
      default: null,
      ":hover": {
        default: null,
        "@media (hover: hover)": "var(--window-control-close)",
      },
    },
  },
});
