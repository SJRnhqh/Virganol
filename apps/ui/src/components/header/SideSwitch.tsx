// apps/ui/src/components/header/SideSwitch.tsx
import { props } from "@stylexjs/stylex";
import type { JSX } from "react";

import { useSidebarStore } from "@/store";
import { sideSwitchStyles } from "@/styles";
import { sideSwitchIcon } from "@/icons";

/** Side switch of the application.
 *
 * 应用的侧栏换边按钮。
 */
export function SideSwitch(): JSX.Element {
  const handleSwitch = useSidebarStore((state) => state.toggleSide);

  return (
    <button {...props(sideSwitchStyles.button)} onClick={handleSwitch}>
      {sideSwitchIcon}
    </button>
  );
}
