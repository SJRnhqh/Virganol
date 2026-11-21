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
  minimize: createElement(Minus, props(windowControlsIconsStyles.icon)),
  maximize: createElement(Maximize2, props(windowControlsIconsStyles.icon)),
  restore: createElement(Minimize2, props(windowControlsIconsStyles.icon)),
  close: createElement(X, props(windowControlsIconsStyles.icon)),
} as const;
