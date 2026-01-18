import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";

interface WindowHeaderProps {
  activeId: string;
}

export function WindowHeader({ activeId }: WindowHeaderProps) {
  // 根据当前 activeId 获取配置
  const currentItem = useMemo(() => {
    return NAV_ITEMS.find((item) => item.id === activeId);
  }, [activeId]);

  // 映射 V.I.N.E. 逻辑分组名称
  const groupLabel = useMemo(() => {
    const groupMap: Record<string, string> = {
      logic: "Cognition",
      infra: "Infrastructure",
      assets: "Assets",
    };
    return currentItem ? groupMap[currentItem.group] : "Core";
  }, [currentItem]);

  return (
    <header
      className="h-10 flex items-center px-20 border-b border-sidebar-border bg-sidebar-bg shrink-0 select-none cursor-default"
      // 保持全域拖拽能力
      data-tauri-drag-region
    >
      {/* 极致简约的面包屑，调整了字号、间距与透明度层级 */}
      <nav className="flex items-center text-[10px] font-medium tracking-widest pointer-events-none">
        {/* 第一层：项目名 (低饱和度) */}
        <span className="text-primary/20 uppercase">Virganol</span>

        {/* 间距调整：mx-3 (12px) 让层级更清晰 */}
        <ChevronRight size={10} className="mx-3 text-primary/10" />

        {/* 第二层：逻辑组 (中等饱和度) */}
        <span className="text-primary/40 uppercase font-light">
          {groupLabel}
        </span>

        <ChevronRight size={10} className="mx-3 text-primary/10" />

        {/* 第三层：当前 Deck (高饱和度/加粗) */}
        <span className="text-primary/90 font-bold tracking-normal">
          {currentItem?.label}
        </span>
      </nav>
    </header>
  );
}
