// apps/ui/src/layouts/MainLayout.tsx
import { props } from "@stylexjs/stylex";
import { useShallow } from "zustand/react/shallow";

import { useNavigationStore, useSidebarStore } from "@/store";
import { useKeyboardShortcuts } from "@/hooks";
import { mainLayoutStyles } from "@/styles";
import { MainStage, SettingsModal, Sidebar, WindowHeader } from "@/components";

/** Shell layout of the application.
 *
 * 应用的外壳布局。
 */
export function MainLayout() {
  const side = useSidebarStore((state) => state.side);
  const { activeNavId, setActiveNavId } = useNavigationStore(
    useShallow((state) => ({
      activeNavId: state.activeNavId,
      setActiveNavId: state.setActiveNavId,
    }))
  );

  useKeyboardShortcuts();

  return (
    <div {...props(mainLayoutStyles.root)}>
      <WindowHeader />

      <div
        {...props(mainLayoutStyles.workspace, side === "right" && mainLayoutStyles.workspaceRight)}
      >
        <Sidebar activeNavId={activeNavId} setActiveNavId={setActiveNavId} />

        <MainStage activeId={activeNavId} />
      </div>

      <SettingsModal />
    </div>
  );
}
