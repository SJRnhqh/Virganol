// apps/ui/src/layouts/MainLayout.tsx
import { MainStage, SettingsModal, Sidebar, WindowHeader } from "@/components";
import { useKeyboardShortcuts } from "@/hooks";
import { cn } from "@/lib";
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-main-bg text-primary">
      <WindowHeader />

      <div
        className={cn(
          "relative flex-1 w-full h-full overflow-hidden flex",
          side === "left" ? "flex-row" : "flex-row-reverse",
        )}
      >
        <Sidebar activeNavId={activeNavId} setActiveNavId={setActiveNavId} />

        <MainStage activeId={activeNavId} />
      </div>

      <SettingsModal />
    </div>
  );
}
