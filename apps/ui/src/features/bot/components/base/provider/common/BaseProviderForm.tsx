// apps/ui/src/features/bot/components/base/provider/common/BaseProviderForm.tsx
// 内部引用
import type { ProviderField } from "@/features/bot/types";

interface BaseProviderFormProps {
  fields: ProviderField[];
  value: Record<string, string>;
  onChange: (key: string, val: string) => void;
  disabled?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  optionalClassName?: string;
}

export const BaseProviderForm = ({
  fields,
  value,
  onChange,
  disabled = false,
  labelClassName,
  inputClassName,
  optionalClassName,
}: BaseProviderFormProps) => {
  return (
    <div className="pb-2 pl-1 space-y-2 pt-0">
      {fields.map((field) => (
        <div key={field.key} className="grid gap-2">
          <label className={labelClassName}>
            {field.label}
            {field.optional && (
              <span className={optionalClassName}>(Optional)</span>
            )}
          </label>
          <input
            type={field.type}
            value={value[field.key] ?? ""}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={inputClassName}
            disabled={disabled}
            autoComplete={field.type === "password" ? "off" : undefined}
            spellCheck={field.type === "text" ? false : undefined}
          />
        </div>
      ))}
    </div>
  );
};
