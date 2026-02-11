// apps/ui/src/features/bot/components/base/providers/BaseProvider.tsx
// 外部依赖
import { useState } from "react";

// 内部引用
import { BaseExpandableMenu } from "@/components/base/BaseExpandableMenu";
import type {
  ProviderDefinition,
  ProviderConnectionProps,
  ProviderModelProps,
} from "@/features/bot/types";

import { ProviderHeader } from "./ProviderHeader";
import { ProviderBody } from "./ProviderBody";

interface BaseProviderProps {
  definition: ProviderDefinition;
  icon: React.ReactNode;
  value: Record<string, string>;
  onValueChange: (value: Record<string, string>) => void;
  connection: ProviderConnectionProps;
  models: ProviderModelProps;
}

export const BaseProvider = ({
  definition,
  icon,
  value,
  onValueChange,
  connection,
  models,
}: BaseProviderProps) => {
  const [open, setOpen] = useState(false);

  const updateField = (key: string, val: string) => {
    onValueChange({ ...value, [key]: val });
  };

  const handleReset = () => {
    onValueChange(definition.defaultConfig);
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
          isConnected={connection.isConnected}
          open={open}
        />
      }
    >
      <ProviderBody
        fields={definition.fields}
        value={value}
        onFieldChange={updateField}
        onReset={handleReset}
        connection={connection}
        models={models}
      />
    </BaseExpandableMenu>
  );
};
