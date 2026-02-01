import { useState } from "react";
import { Check } from "lucide-react";
import { BaseExpandableMenu } from "@/components/base/BaseExpandableMenu";
import type { ProviderDefinition } from "@/features/bot/types/llmProviders";
import { ProviderFormFields } from "../forms/ProviderFormFields";
import { ConnectButton } from "../buttons/Connect";

interface BaseProviderProps {
  definition: ProviderDefinition;
  icon: React.ReactNode;
  onConnect?: (config: Record<string, string>) => Promise<void>;
  onDisconnect?: () => void;
  isConnected?: boolean;
  isLoading?: boolean;
}

export const BaseProvider = ({
  definition,
  icon,
  onConnect,
  onDisconnect,
  isConnected = false,
  isLoading = false,
}: BaseProviderProps) => {
  const [value, setValue] = useState<Record<string, string>>(
    definition.defaultConfig,
  );
  const [open, setOpen] = useState(false);

  const updateField = (key: string, val: string) => {
    setValue((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setValue(definition.defaultConfig);
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
        <div className="flex items-center gap-3.5">
          <span
            className={[
              "transition-colors duration-200",
              open
                ? "text-settings-panel-fg"
                : "text-settings-panel-fg/60 group-hover:text-settings-panel-fg",
            ].join(" ")}
          >
            {icon}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={[
                "text-sm font-medium transition-colors",
                open
                  ? "text-settings-panel-fg"
                  : "text-settings-panel-fg/60 group-hover:text-settings-panel-fg",
              ].join(" ")}
            >
              {definition.name}
            </span>
            {isConnected && !open && (
              <Check className="w-4 h-4 text-settings-panel-check" />
            )}
          </div>
        </div>
      }
    >
      <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />

      <ProviderFormFields
        fields={definition.fields}
        value={value}
        onChange={updateField}
        isConnected={isConnected}
        onReset={handleReset}
      />

      <ConnectButton
        onClick={() => onConnect?.(value)}
        isConnected={isConnected}
        isLoading={isLoading}
      />
    </BaseExpandableMenu>
  );
};
