// apps/ui/src/layouts/MainLayout.tsx
import { MainStage, SettingsModal, Sidebar, WindowHeader } from "@/components";
import { useKeyboardShortcuts } from "@/hooks";
import { useNavigationStore, useSidebarStore } from "@/store";

/** Shell layout of the application.
 *
 * 应用的外壳布局。
 */
export function MainLayout() {
  const { side } = useSidebarStore();
  const activeNavId = useNavigationStore((state) => state.activeNavId);
  const setActiveNavId = useNavigationStore((state) => state.setActiveNavId);

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
