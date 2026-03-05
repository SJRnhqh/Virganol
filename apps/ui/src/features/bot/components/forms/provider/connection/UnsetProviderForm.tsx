// apps/ui/src/features/bot/components/forms/provider/connection/UnsetProviderForm.tsx
// 内部引用
import type { ProviderField } from "@/features/bot/types";
import { BaseProviderForm } from "@/features/bot/components/base/provider/common";

interface UnsetProviderFormProps {
  fields: ProviderField[];
  value: Record<string, string>;
  onChange: (key: string, val: string) => void;
}

export const UnsetProviderForm = ({
  fields,
  value,
  onChange,
}: UnsetProviderFormProps) => {
  return (
    <BaseProviderForm
      fields={fields}
      value={value}
      onChange={onChange}
      disabled={false}
      labelClassName="text-[10px] uppercase tracking-widest text-settings-panel-fg/60 font-bold ml-1 select-none"
      inputClassName="w-full bg-settings-panel-fg/10 text-settings-panel-fg border-none rounded-lg px-3.5 py-2.5 text-xs font-mono placeholder:text-settings-panel-fg/40 shadow-inner focus:outline-none focus:bg-settings-panel-fg/15 focus:ring-1 focus:ring-settings-panel-fg/20 transition-all duration-200"
      optionalClassName="text-settings-panel-fg/40 font-normal normal-case tracking-normal ml-1"
    />
  );
};
