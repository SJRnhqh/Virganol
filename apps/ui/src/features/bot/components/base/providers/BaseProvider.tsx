// apps/ui/src/features/bot/components/base/providers/BaseProvider.tsx
// 外部依赖
import { useState } from "react";

// 内部引用
import { BaseExpandableMenu } from "@/components/base/BaseExpandableMenu";
import type { ProviderDefinition } from "@/features/bot/types/providers";
import { ProviderHeader } from "./ProviderHeader";
import { ProviderBody } from "./ProviderBody";

interface BaseProviderProps {
  definition: ProviderDefinition;
  icon: React.ReactNode;
  onConnect?: (config: Record<string, string>) => Promise<void>;
  onDisconnect?: () => void;
  isConnected?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onErrorReset?: () => void;
  value: Record<string, string>;
  onValueChange: (value: Record<string, string>) => void;
  availableModels?: string[];
  enabledModels?: Record<string, boolean>;
  onModelToggle?: (model: string, enabled: boolean) => void;
  onToggleAllModels?: (enabled: boolean) => void;
}

export const BaseProvider = ({
  definition,
  icon,
  onConnect,
  onDisconnect,
  isConnected = false,
  isLoading = false,
  isError = false,
  errorMessage,
  onErrorReset,
  value,
  onValueChange,
  availableModels,
  enabledModels,
  onModelToggle,
  onToggleAllModels,
}: BaseProviderProps) => {
  const [open, setOpen] = useState(false);

  const updateField = (key: string, val: string) => {
    onValueChange({ ...value, [key]: val });
  };

  const handleReset = () => {
    onValueChange(definition.defaultConfig);
    onDisconnect?.();
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
          isConnected={isConnected}
          open={open}
        />
      }
    >
      <ProviderBody
        fields={definition.fields}
        value={value}
        isConnected={isConnected}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        onFieldChange={updateField}
        onReset={handleReset}
        onConnect={onConnect}
        onErrorReset={onErrorReset}
        availableModels={availableModels}
        enabledModels={enabledModels}
        onModelToggle={onModelToggle}
        onToggleAllModels={onToggleAllModels}
      />
    </BaseExpandableMenu>
  );
};
