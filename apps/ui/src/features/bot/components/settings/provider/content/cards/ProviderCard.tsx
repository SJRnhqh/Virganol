// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderCard.tsx
// 外部依赖
import { useState } from "react";

// 内部引用
import { cn } from "@/lib";
import type { ProviderCardProps } from "@/features/bot/types";
import { BaseExpandableMenu } from "@/components/base/BaseExpandableMenu";
import { ProviderCardHeader } from "./ProviderCardHeader";
import { ProviderCardBody } from "./ProviderCardBody";

export const ProviderCard = ({
  cardState,
  provider,
  form,
  errorMessage,
  connection,
}: ProviderCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <BaseExpandableMenu
      open={open}
      onOpenChange={setOpen}
      collapseStrategy="grid"
      className={cn(
        // 基础布局
        "w-full transition-all duration-300",
        // 展开/收起状态
        open
          ? "bg-settings-panel-fg/5 shadow-sm"
          : "bg-transparent hover:bg-settings-panel-fg/5",
      )}
      headerClassName={cn(
        // 布局与交互
        "w-full flex items-center justify-between px-5 py-2",
        "group outline-none cursor-pointer select-none leading-none",
      )}
      chevronClassName={cn(
        // 图标样式
        "w-3.5 h-3.5 text-settings-panel-fg/40",
        "transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]",
        // 展开时旋转
        open && "rotate-180 text-settings-panel-fg/80",
      )}
      contentOuterClassName={cn(
        // 网格动画容器
        "grid transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]",
        // 展开/收起动画
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
      contentInnerClassName="overflow-hidden px-5"
      title={
        <ProviderCardHeader
          cardState={cardState}
          provider={provider}
          open={open}
        />
      }
    >
      <ProviderCardBody
        provider={provider}
        cardState={cardState}
        form={form}
        errorMessage={errorMessage}
        connection={connection}
      />
    </BaseExpandableMenu>
  );
};
