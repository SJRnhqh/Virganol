// apps/ui/src/features/bot/components/settings/provider/content/ProviderItem.tsx
// 内部引用
import type { WithProviderId } from "@/features/bot/types";
import { useProvider } from "@/features/bot/hooks";
import { ProviderCard } from "@/features/bot/components/base";

export const ProviderItem = ({ providerId }: WithProviderId) => {
  const provider = useProvider(providerId);

  return (
    <ProviderCard
      meta={provider.meta}
      definition={provider.definition}
      form={{
        formData: provider.formData,
        onUpdate: provider.updateFormData,
      }}
      connection={provider.connection}
      models={provider.models}
    />
  );
};
