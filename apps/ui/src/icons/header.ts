// apps/ui/src/icons/header.ts
import { props } from "@stylexjs/stylex";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { createElement } from "react";

import { windowControlsStyles } from "@/styles";

/** Window control icons of the application.
 *
 * 应用的窗口控制按钮组图标。
 */
export const windowControlsIcons = {
  minimize: createElement(
    Minus,
    props(windowControlsStyles.icon, windowControlsStyles.minimizeIcon)
  ),
  maximize: createElement(Maximize2, props(windowControlsStyles.toggleMaximizeIcon)),
  restore: createElement(Minimize2, props(windowControlsStyles.toggleMaximizeIcon)),
  close: createElement(X, props(windowControlsStyles.icon)),
} as const;
