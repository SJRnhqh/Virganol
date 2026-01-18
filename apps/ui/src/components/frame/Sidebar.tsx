import { memo, useState, Fragment } from "react";
import { Settings } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { NavItem } from "./NavItem";
import { ActiveIndicator } from "./ActiveIndicator";

export const Sidebar = memo(() => {
  const [activeId, setActiveId] = useState("bot");

  return (
    <aside className="flex flex-col items-center shrink-0 z-40 w-16 h-full bg-sidebar-bg border-r border-sidebar-border text-sidebar-fg transition-all duration-300 pt-3 pb-4">
      <nav className="flex flex-col items-center w-full flex-1 relative">
        {/* 滑块 */}
        <ActiveIndicator activeId={activeId} />

        {/* 菜单组 */}
        {NAV_ITEMS.map((item, index) => (
          <Fragment key={item.id}>
            {/* 分组分割线 */}
            {index > 0 &&
              NAV_ITEMS[index].group !== NAV_ITEMS[index - 1].group && (
                <div className="w-8 h-px bg-sidebar-border mb-3 mt-1 shrink-0 opacity-40" />
              )}

            <NavItem
              icon={item.icon}
              label={item.label}
              isActive={activeId === item.id}
              onClick={() => setActiveId(item.id)}
            />
          </Fragment>
        ))}
      </nav>

      <div className="mt-auto">
        <NavItem
          icon={Settings}
          label="Settings"
          isActive={false}
          onClick={() => console.log("Open Settings")}
          showMargin={false}
        />
      </div>
    </aside>
  );
});
