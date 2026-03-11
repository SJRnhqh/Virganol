// apps/ui/src/features/bot/components/base/provider/BaseProvider.tsx
// 外部依赖
import { useState } from "react";

// 内部引用
import type {
  ProviderFormData,
  ProviderDefinition,
  ProviderConnectionProps,
  ProviderModelProps,
} from "@/features/bot/types";
import { PROVIDER_INITIAL_FORMS } from "@/features/bot/constants";
import { BaseExpandableMenu } from "@/components/base/BaseExpandableMenu";
import { ProviderHeader, ProviderBody } from "./content";

interface BaseProviderProps {
  formData: ProviderFormData;
  updateFormData: (formData: ProviderFormData) => void;
  definition: ProviderDefinition;
  icon: React.ReactNode;
  connection: ProviderConnectionProps;
  models: ProviderModelProps;
}

export const BaseProvider = ({
  formData,
  updateFormData,
  definition,
  icon,
  connection,
  models,
}: BaseProviderProps) => {
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
      className={[
        "w-full transition-all duration-300",
        open
          ? "bg-settings-panel-fg/5 shadow-sm"
          : "bg-transparent hover:bg-settings-panel-fg/5",
      ].join(" ")}
      headerClassName="w-full flex items-center justify-between px-5 py-2 group outline-none cursor-pointer select-none leading-none"
      chevronClassName={[
        "w-3.5 h-3.5 text-settings-panel-fg/40 transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]",
        open ? "rotate-180 text-settings-panel-fg/80" : "",
      ].join(" ")}
      contentOuterClassName={[
        "grid transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      ].join(" ")}
      contentInnerClassName="overflow-hidden px-5"
      title={
        <ProviderHeader
          icon={icon}
          name={definition.name}
          cardState={connection.cardState}
          open={open}
        />
      }
    >
      <ProviderBody
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
