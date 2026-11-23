// apps/ui/src/components/header/SidebarToggleButton.tsx
import { props } from "@stylexjs/stylex";
import type { JSX } from "react";
import { useShallow } from "zustand/react/shallow";

import { useSidebarStore } from "@/store";
import { headerSharedStyles, sidebarToggleButtonStyles } from "@/styles";
import { sidebarToggleButtonIcon } from "@/icons";

/** Sidebar toggle button of the application.
 *
 * 应用的侧栏开合按钮。
 */
export function SidebarToggleButton(): JSX.Element {
  const {
    isOpen,
    side,
    toggle: handleToggle,
  } = useSidebarStore(useShallow(({ isOpen, side, toggle }) => ({ isOpen, side, toggle })));

  return (
    <button
      {...props(
        headerSharedStyles.button,
        headerSharedStyles.buttonBg,
        side === "right" && sidebarToggleButtonStyles.mirrored,
        !isOpen && sidebarToggleButtonStyles.closed
      )}
      onClick={handleToggle}
    >
      {sidebarToggleButtonIcon}
    </button>
  );
}
