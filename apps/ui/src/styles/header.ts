// apps/ui/src/styles/header.ts
import { create } from "@stylexjs/stylex";

import { colorTokens } from "./token.stylex";

/** Shared window header styles of the application.
 *
 * 应用的窗口顶栏共享样式。
 */
export const headerSharedStyles = create({
  root: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
  },
  button: {
    borderRadius: "0.375rem",
    placeItems: "center",
    color: {
      default: colorTokens.headerIcon,
      ":hover": {
        default: null,
        "@media (hover: hover)": colorTokens.headerIconHover,
      },
    },
    display: "grid",
    height: "100%",
    width: "2.5rem",
  },
  icon: {
    height: 16,
    width: 16,
  },
});

/** Window header styles of the application.
 *
 * 应用的窗口顶栏样式。
 */
export const windowHeaderStyles = create({
  root: {
    paddingInline: "0.75rem",
    backgroundColor: colorTokens.headerBg,
    cursor: "default",
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
  windowEdgeAlignment: {
    paddingInlineEnd: 0,
  },
  breadcrumbWrap: { // TBD
    zIndex: 10,
    height: "100%",
  },
  controls: { // TBD
    gap: "0.25rem",
    alignItems: "center",
    display: "flex",
    height: "100%",
    marginLeft: "auto",
    marginRight: "0.25rem",
  },
});

/** Side switch button styles of the application.
 *
 * 应用的侧栏换边按钮样式。
 */
export const sideSwitchButtonStyles = create({
  root: {
    // The background stays on the legacy CSS variable until the color token rework.
    backgroundColor: {
      default: null,
      ":hover": {
        default: null,
        "@media (hover: hover)": "var(--header-icon-bg)",
      },
    },
    transitionDuration: "300ms",
    transitionProperty: "background-color, color",
    transitionTimingFunction: "ease-in-out",
  },
});

/** Window control styles of the application.
 *
 * 应用的窗口控制按钮组样式。
 */
export const windowControlsStyles = create({
  root: {
    height: "100%",
  },
  minimizeButton: {
    backgroundColor: {
      default: null,
      ":hover": {
        default: null,
        "@media (hover: hover)": colorTokens.windowMinimizeHoverBg,
      },
    },
  },
  maximizeButton: {
    backgroundColor: {
      default: null,
      ":hover": {
        default: null,
        "@media (hover: hover)": colorTokens.windowToggleMaximizeHoverBg,
      },
    },
  },
  closeButton: {
    backgroundColor: {
      default: null,
      ":hover": {
        default: null,
        "@media (hover: hover)": colorTokens.windowCloseHoverBg,
      },
    },
  },
});
