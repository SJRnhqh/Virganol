// apps/ui/src/layouts/MainLayout.tsx
import { MainStage, SettingsModal, Sidebar, WindowHeader } from "@/components";
import { useKeyboardShortcuts } from "@/hooks";
import { cn } from "@/lib";
import { useSidebarStore } from "@/store";

/** Composes the application shell and hosts the active feature workspace.
 *
 * 组合应用外壳并承载当前功能工作区。
 */
export function MainLayout() {
  const { side, activeId, setActiveId } = useSidebarStore();

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
        <Sidebar activeId={activeId} onActiveIdChange={setActiveId} />

        <MainStage activeId={activeId} />
      </div>

      <SettingsModal />
    </div>
  );
}
