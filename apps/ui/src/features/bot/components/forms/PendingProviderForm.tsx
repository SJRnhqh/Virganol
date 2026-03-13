// apps/ui/src/features/bot/components/forms/PendingProviderForm.tsx
// 内部引用
import type { ProviderEditableContent } from "@/features/bot/types";
import { BaseProviderForm } from "@/features/bot/components/base/provider/common";

export const PendingProviderForm = ({
  fields,
  form,
}: ProviderEditableContent) => {
  return (
    <BaseProviderForm
      fields={fields}
      formData={form.formData}
      onUpdate={form.onUpdate}
      disabled={true}
      labelClassName="text-[10px] uppercase tracking-widest text-settings-panel-fg/40 font-bold ml-1 select-none"
      inputClassName="w-full bg-settings-panel-fg/10 text-settings-panel-fg/40 border-none rounded-lg px-3.5 py-2.5 text-xs font-mono cursor-not-allowed animate-pulse"
      optionalClassName="text-settings-panel-fg/30 font-normal normal-case tracking-normal ml-1"
    />
  );
};
