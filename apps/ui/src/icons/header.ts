// apps/ui/src/icons/header.ts
import { props } from "@stylexjs/stylex";
import { ArrowLeftRight, Minus, PanelLeft, Square, X } from "lucide-react";
import { createElement } from "react";

import { headerSharedStyles } from "@/styles";
import { RestoreWindow } from "./RestoreWindow";

/** Side switch button icon of the application.
 *
 * 应用的侧栏换边按钮图标。
 */
export const sideSwitchButtonIcon = createElement(ArrowLeftRight, props(headerSharedStyles.icon));

/** Sidebar toggle icon of the application.
 *
 * 应用的侧栏开合按钮图标。
 */
export const sidebarToggleIcon = createElement(PanelLeft, props(headerSharedStyles.icon));

/** Window control icons of the application.
 *
 * 应用的窗口控制按钮组图标。
 */
export const windowControlsIcons = {
  minimize: createElement(Minus, props(headerSharedStyles.icon)),
  maximize: createElement(Square, props(headerSharedStyles.icon)),
  restore: createElement(RestoreWindow, props(headerSharedStyles.icon)),
  close: createElement(X, props(headerSharedStyles.icon)),
} as const;
