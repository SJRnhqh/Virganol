// apps/ui/src/features/bot/components/forms/provider/ProviderForm.tsx
// 内部引用
import type { ProviderField } from "@/features/bot/types";
import {
  PROVIDER_CARD_STATES,
  type ProviderCardState,
} from "@/features/bot/constants";
import {
  UnsetProviderForm,
  PendingProviderForm,
  FailedProviderForm,
} from "./connection";

interface ProviderFormProps {
  cardState: ProviderCardState;
  fields: ProviderField[];
  value: Record<string, string>;
  onChange: (key: string, val: string) => void;
  errorMessage?: string | null;
}

export const ProviderForm = ({
  cardState,
  fields,
  value,
  onChange,
  errorMessage,
}: ProviderFormProps) => {
  if (cardState === PROVIDER_CARD_STATES.UNSET) {
    return (
      <UnsetProviderForm fields={fields} value={value} onChange={onChange} />
    );
  }

  if (cardState === PROVIDER_CARD_STATES.PENDING) {
    return (
      <PendingProviderForm fields={fields} value={value} onChange={onChange} />
    );
  }

  if (cardState === PROVIDER_CARD_STATES.FAILED) {
    return <FailedProviderForm errorMessage={errorMessage} />;
  }

  return null;
};
