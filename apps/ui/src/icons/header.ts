// apps/ui/src/icons/header.ts
import { props } from "@stylexjs/stylex";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { createElement } from "react";

import { windowControlsIconsStyles } from "@/styles";

/** Window control icons of the application.
 *
 * 应用的窗口控制按钮组图标。
 */
export const windowControlsIcons = {
  minimize: createElement(
    Minus,
    props(windowControlsIconsStyles.icon, windowControlsIconsStyles.minimizeIcon)
  ),
  maximize: createElement(Maximize2, props(windowControlsIconsStyles.toggleMaximizeIcon)),
  restore: createElement(Minimize2, props(windowControlsIconsStyles.toggleMaximizeIcon)),
  close: createElement(X, props(windowControlsIconsStyles.icon)),
} as const;
