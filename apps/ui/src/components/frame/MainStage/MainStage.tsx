// apps/ui/src/components/frame/MainStage/MainStage.tsx
import { AnimatePresence, motion } from "framer-motion";
import { Construction, Rocket } from "lucide-react";

import { NAV_ITEMS } from "@/constants";
import { BotDashboard } from "@/features";
import { DevelopingView } from "./DevelopingView";

/** Hosts the active feature workspace with a shutter-style deck transition.
 *
 * 承载当前功能工作区，并以快门式转场切换工位。
 */
export function MainStage({ activeId }: MainStageProps) {
  return (
    <main className="flex-1 h-full bg-main-bg isolate relative min-w-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-full p-6"
        >
          {renderContent(activeId)}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

/** Props for the main stage.
 *
 * 主舞台的属性。
 */
interface MainStageProps {
  /**
   * Id of the active navigation item.
   *
   * 当前激活的导航项标识。
   */
  activeId: string;
}

/** Assembles the stage content for the given active navigation item.
 *
 * 按激活的导航项装配舞台内容。
 */
function renderContent(activeId: string) {
  switch (activeId) {
    case "scispirit":
      return <BotDashboard key="scispirit" />;

    case "sciapiary":
      return (
        <DevelopingView
          key="sciapiary"
          title="SciApiary (Orchestration Hub)"
          icon={Construction}
        />
      );

    default: {
      const config = NAV_ITEMS.find((i) => i.id === activeId);
      return (
        <DevelopingView
          key={activeId}
          title={config?.label || "Unknown Deck"}
          icon={config?.icon || Rocket}
        />
      );
    }
  }
}
