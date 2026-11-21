// apps/ui/src/icons/header.ts
import { props } from "@stylexjs/stylex";
import { Minus, Square, X } from "lucide-react";
import { createElement } from "react";

import { windowControlsIconsStyles } from "@/styles";
import { RestoreWindow } from "./RestoreWindow";

/** Window control icons of the application.
 *
 * 应用的窗口控制按钮组图标。
 */
export const windowControlsIcons = {
  minimize: createElement(Minus, props(windowControlsIconsStyles.icon)),
  maximize: createElement(Square, props(windowControlsIconsStyles.icon)),
  restore: createElement(RestoreWindow, props(windowControlsIconsStyles.icon)),
  close: createElement(X, props(windowControlsIconsStyles.icon)),
} as const;
