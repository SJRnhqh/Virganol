import { useState } from "react";
import { BaseExpandableMenu } from "@/components/base/BaseExpandableMenu";
import type { ProviderDefinition } from "@/features/bot/types/llmProviders";

interface BaseProviderProps {
  definition: ProviderDefinition;
  icon: React.ReactNode;
}

export const BaseProvider = ({ definition, icon }: BaseProviderProps) => {
  const [value, setValue] = useState<Record<string, string>>(definition.defaultConfig);
  const [open, setOpen] = useState(false);

  const updateField = (key: string, val: string) => {
    setValue((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <BaseExpandableMenu
      open={open}
      onOpenChange={setOpen}
      collapseStrategy="grid"
      className={[
        "w-full transition-all duration-300",
        open ? "bg-settings-panel-fg/5 shadow-sm" : "bg-transparent hover:bg-settings-panel-fg/5",
      ].join(" ")}
      headerClassName="w-full flex items-center justify-between px-5 py-4 group outline-none cursor-pointer select-none leading-none"
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
              open ? "text-settings-panel-fg" : "text-settings-panel-fg/60 group-hover:text-settings-panel-fg",
            ].join(" ")}
          >
            {icon}
          </span>
          <span
            className={[
              "text-sm font-medium transition-colors",
              open ? "text-settings-panel-fg" : "text-settings-panel-fg/60 group-hover:text-settings-panel-fg",
            ].join(" ")}
          >
            {definition.name}
          </span>
        </div>
      }
    >
      <div className="w-full border-t border-dashed border-settings-panel-fg/10 mb-4" />
      <div className="pb-5 pl-1 space-y-6 pt-1">
        {definition.fields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <label className="text-[10px] uppercase tracking-widest text-settings-panel-fg/60 font-bold ml-1 select-none">
              {field.label}
              {field.optional && (
                <span className="text-settings-panel-fg/40 font-normal normal-case tracking-normal ml-1">
                  (Optional)
                </span>
              )}
            </label>
            <input
              type={field.type}
              value={value[field.key] ?? ""}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-settings-panel-fg/10 text-settings-panel-fg border-none rounded-lg px-3.5 py-2.5 text-xs font-mono placeholder:text-settings-panel-fg/40 shadow-inner focus:outline-none focus:bg-settings-panel-fg/15 focus:ring-1 focus:ring-settings-panel-fg/20 transition-all duration-200"
              autoComplete={field.type === "password" ? "off" : undefined}
              spellCheck={field.type === "text" ? false : undefined}
            />
          </div>
        ))}
      </div>
    </BaseExpandableMenu>
  );
};
