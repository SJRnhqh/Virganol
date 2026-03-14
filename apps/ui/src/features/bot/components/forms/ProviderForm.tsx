// apps/ui/src/features/bot/components/forms/ProviderForm.tsx
// 内部引用
import type { ProviderFormData, ProviderFormProps } from "@/features/bot/types";
import { PROVIDER_FORM_VARIANTS } from "@/features/bot/constants";

export const ProviderForm = ({
  cardState,
  fields,
  form,
}: ProviderFormProps) => {
  const variant = PROVIDER_FORM_VARIANTS[cardState];

  const handleFieldChange = (key: keyof ProviderFormData, value: string) => {
    form.onUpdate({ ...form.formData, [key]: value });
  };

  return (
    <div className="pb-2 pl-1 space-y-2 pt-0">
      {fields.map((field) => (
        <div key={field.key} className="grid gap-2">
          <label className={variant.labelClassName}>
            {field.label}
            {field.optional && (
              <span className={variant.optionalClassName}>(Optional)</span>
            )}
          </label>
          <input
            type={field.type}
            value={form.formData[field.key] ?? ""}
            onChange={(event) =>
              handleFieldChange(field.key, event.target.value)
            }
            placeholder={field.placeholder}
            className={variant.inputClassName}
            disabled={variant.disabled}
            autoComplete={field.type === "password" ? "off" : undefined}
            spellCheck={field.type === "text" ? false : undefined}
          />
        </div>
      ))}
    </div>
  );
};
