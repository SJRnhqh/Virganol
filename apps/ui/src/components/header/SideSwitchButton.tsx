// apps/ui/src/components/header/SideSwitchButton.tsx
import { props } from "@stylexjs/stylex";
import type { JSX } from "react";

import { useSidebarStore } from "@/store";
import { sideSwitchButtonStyles } from "@/styles";
import { sideSwitchButtonIcon } from "@/icons";

/** Side switch button of the application.
 *
 * 应用的侧栏换边按钮。
 */
export function SideSwitchButton(): JSX.Element {
  const handleSwitch = useSidebarStore((state) => state.toggleSide);

  return (
    <button {...props(sideSwitchButtonStyles.root)} onClick={handleSwitch}>
      {sideSwitchButtonIcon}
    </button>
  );
}
