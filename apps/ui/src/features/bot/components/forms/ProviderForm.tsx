// apps/ui/src/features/bot/components/forms/ProviderForm.tsx
// 内部引用
import type {
  ProviderFormData,
  ProviderCardState,
  ProviderEditableContent,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";

type EditableProviderCardState = Extract<
  ProviderCardState,
  "unset" | "pending"
>;

interface ProviderFormVariantStyles {
  disabled: boolean;
  labelClassName: string;
  inputClassName: string;
  optionalClassName: string;
}

interface ProviderFormProps extends ProviderEditableContent {
  cardState: EditableProviderCardState;
}

const PROVIDER_FORM_VARIANTS = {
  [PROVIDER_CARD_STATES.UNSET]: {
    disabled: false,
    labelClassName:
      "text-[10px] uppercase tracking-widest text-settings-panel-fg/60 font-bold ml-1 select-none",
    inputClassName:
      "w-full bg-settings-panel-fg/10 text-settings-panel-fg border-none rounded-lg px-3.5 py-2.5 text-xs font-mono placeholder:text-settings-panel-fg/40 shadow-inner focus:outline-none focus:bg-settings-panel-fg/15 focus:ring-1 focus:ring-settings-panel-fg/20 transition-all duration-200",
    optionalClassName:
      "text-settings-panel-fg/40 font-normal normal-case tracking-normal ml-1",
  },
  [PROVIDER_CARD_STATES.PENDING]: {
    disabled: true,
    labelClassName:
      "text-[10px] uppercase tracking-widest text-settings-panel-fg/40 font-bold ml-1 select-none",
    inputClassName:
      "w-full bg-settings-panel-fg/10 text-settings-panel-fg/40 border-none rounded-lg px-3.5 py-2.5 text-xs font-mono cursor-not-allowed animate-pulse",
    optionalClassName:
      "text-settings-panel-fg/30 font-normal normal-case tracking-normal ml-1",
  },
} satisfies Record<EditableProviderCardState, ProviderFormVariantStyles>;

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
