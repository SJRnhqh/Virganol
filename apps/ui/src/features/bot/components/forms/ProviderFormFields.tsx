import type { ProviderField } from "@/features/bot/types/llmProviders";

interface ProviderFormFieldsProps {
  fields: ProviderField[];
  value: Record<string, string>;
  onChange: (key: string, val: string) => void;
}

export const ProviderFormFields = ({
  fields,
  value,
  onChange,
}: ProviderFormFieldsProps) => {
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
