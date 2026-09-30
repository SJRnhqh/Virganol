// apps/ui/src/layouts/MainLayout.tsx
import { useShallow } from "zustand/react/shallow";

import { MainStage, SettingsModal, Sidebar, WindowHeader } from "@/components";
import { useKeyboardShortcuts } from "@/hooks";
import { useNavigationStore, useSidebarStore } from "@/store";

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
    })),
  );

  useKeyboardShortcuts();

  return (
    <div className="main-layout">
      <WindowHeader />

      <div className="main-layout__workspace" data-side={side}>
        <Sidebar activeNavId={activeNavId} setActiveNavId={setActiveNavId} />

        <MainStage activeId={activeNavId} />
      </div>

      <SettingsModal />
    </div>
  );
}
