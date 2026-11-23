// apps/ui/src/components/header/SidebarToggle.tsx
import { props } from "@stylexjs/stylex";
import type { JSX } from "react";
import { useShallow } from "zustand/react/shallow";

import { useSidebarStore } from "@/store";
import { headerSharedStyles, sidebarToggleStyles } from "@/styles";
import { sidebarToggleIcon } from "@/icons";

/** Sidebar toggle button of the application.
 *
 * 应用的侧栏开合按钮。
 */
export function SidebarToggle(): JSX.Element {
  const { isOpen, side, toggle: handleToggle } = useSidebarStore(
    useShallow(({ isOpen, side, toggle }) => ({ isOpen, side, toggle }))
  );

  return (
    <button
      {...props(
        headerSharedStyles.button,
        headerSharedStyles.buttonBg,
        side === "right" && sidebarToggleStyles.mirrored,
        !isOpen && sidebarToggleStyles.closed
      )}
      onClick={handleToggle}
    >
      {sidebarToggleIcon}
    </button>
  );
}
