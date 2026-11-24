// apps/ui/src/components/header/SettingsButton.tsx
import { props } from "@stylexjs/stylex";
import type { JSX } from "react";

import { useSettingsStore } from "@/store";
import { headerSharedStyles } from "@/styles";
import { settingsButtonIcon } from "@/icons";

/** Settings button of the application.
 *
 * 应用的设置按钮。
 */
export function SettingsButton(): JSX.Element {
  const handleOpenSettings = useSettingsStore((state) => state.open);

  return (
    <button
      {...props(headerSharedStyles.button, headerSharedStyles.buttonBg)}
      onClick={handleOpenSettings}
    >
      {settingsButtonIcon}
    </button>
  );
}
