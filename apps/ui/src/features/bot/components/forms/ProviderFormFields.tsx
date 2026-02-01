import type { ProviderField } from "@/features/bot/types/llmProviders";
import { Undo2 } from "lucide-react";

interface ProviderFormFieldsProps {
  fields: ProviderField[];
  value: Record<string, string>;
  onChange: (key: string, val: string) => void;
  isConnected?: boolean;
  onReset?: () => void;
}

export const ProviderFormFields = ({
  fields,
  value,
  onChange,
  isConnected = false,
  onReset,
}: ProviderFormFieldsProps) => {
  if (isConnected) {
    // 获取标记为 URL 的字段
    const urlField = fields.find((f) => f.isUrl);
    const urlValue = urlField ? value[urlField.key] : undefined;

    return (
      <div className="pb-2 pl-1 pt-0">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-settings-panel-fg/70">
            <span className="text-settings-panel-fg/60">Connected to: </span>
            <span className="font-mono text-settings-panel-fg">{urlValue}</span>
          </div>
          {onReset && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onReset();
              }}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-settings-panel-fg/50 hover:text-settings-panel-fg/80 hover:bg-settings-panel-fg/5 transition-all duration-200 rounded-md group cursor-pointer"
              title="Reset connection"
            >
              <Undo2 className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="text-xs font-medium transition-opacity duration-200 group-hover:opacity-100">
                Reset
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-2 pl-1 space-y-2 pt-0">
      {fields.map((field) => (
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
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full bg-settings-panel-fg/10 text-settings-panel-fg border-none rounded-lg px-3.5 py-2.5 text-xs font-mono placeholder:text-settings-panel-fg/40 shadow-inner focus:outline-none focus:bg-settings-panel-fg/15 focus:ring-1 focus:ring-settings-panel-fg/20 transition-all duration-200"
            autoComplete={field.type === "password" ? "off" : undefined}
            spellCheck={field.type === "text" ? false : undefined}
          />
        </div>
      ))}
    </div>
  );
};
