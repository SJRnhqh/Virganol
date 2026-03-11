// apps/ui/src/features/bot/components/settings/provider/content/ProviderItem.tsx
// 内部引用
import type { WithProviderId } from "@/features/bot/types";
import { useProvider } from "@/features/bot/hooks";
import { BaseProvider } from "@/features/bot/components/base";

export const ProviderItem = ({ providerId }: WithProviderId) => {
  const provider = useProvider(providerId);

  return <BaseProvider {...provider} />;
};
