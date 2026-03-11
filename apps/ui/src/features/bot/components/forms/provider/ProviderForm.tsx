// apps/ui/src/features/bot/components/forms/provider/ProviderForm.tsx
// 内部引用
import type {
  ProviderField,
  ProviderFormData,
  ProviderCardState,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import {
  UnsetProviderForm,
  PendingProviderForm,
  FailedProviderForm,
} from "./connection";

interface ProviderFormProps {
  cardState: ProviderCardState;
  fields: ProviderField[];
  formData: ProviderFormData;
  onChange: (key: keyof ProviderFormData, val: string) => void;
  errorMessage?: string | null;
}

export const ProviderForm = ({
  cardState,
  fields,
  formData,
  onChange,
  errorMessage,
}: ProviderFormProps) => {
  if (cardState === PROVIDER_CARD_STATES.UNSET) {
    return (
      <UnsetProviderForm
        fields={fields}
        formData={formData}
        onChange={onChange}
      />
    );
  }

  if (cardState === PROVIDER_CARD_STATES.PENDING) {
    return (
      <PendingProviderForm
        fields={fields}
        formData={formData}
        onChange={onChange}
      />
    );
  }

  if (cardState === PROVIDER_CARD_STATES.FAILED) {
    return <FailedProviderForm errorMessage={errorMessage} />;
  }

  return null;
};
