// apps/ui/src/features/bot/components/base/provider/ProviderCard.tsx
// 外部依赖
import { useState } from "react";

// 内部引用
import { cn } from "@/lib";
import type {
  ProviderFormData,
  ProviderDefinition,
  ProviderConnectionProps,
  ProviderModelProps,
} from "@/features/bot/types";
import { PROVIDER_INITIAL_FORMS } from "@/features/bot/constants";
import { BaseExpandableMenu } from "@/components/base/BaseExpandableMenu";
import { ProviderCardHeader, ProviderCardBody } from "./content";

interface ProviderCardComponentProps {
  formData: ProviderFormData;
  updateFormData: (formData: ProviderFormData) => void;
  definition: ProviderDefinition;
  icon: React.ReactNode;
  connection: ProviderConnectionProps;
  models: ProviderModelProps;
}

export const ProviderCard = ({
  formData,
  updateFormData,
  definition,
  icon,
  connection,
  models,
}: ProviderCardComponentProps) => {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    updateFormData(PROVIDER_INITIAL_FORMS[definition.id]);
    connection.onDisconnect?.();
  };

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
          cardState={connection.cardState}
          meta={{ icon, name: definition.name }}
          open={open}
        />
      }
    >
      <ProviderCardBody
        cardState={connection.cardState}
        fields={definition.fields}
        formData={formData}
        updateFormData={updateFormData}
        onReset={handleReset}
        connection={connection}
        models={models}
      />
    </BaseExpandableMenu>
  );
};
