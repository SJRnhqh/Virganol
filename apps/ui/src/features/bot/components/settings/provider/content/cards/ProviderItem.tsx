// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderItem.tsx
// 内部引用
import type { WithProviderId } from "@/features/bot/types";
import { useProvider } from "@/features/bot/hooks";
import { ProviderCard } from "./ProviderCard";

export const ProviderItem = ({ id }: WithProviderId) => {
  const providerCard = useProvider(id);

  return <ProviderCard {...providerCard} />;
};
