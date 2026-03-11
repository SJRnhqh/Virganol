// apps/ui/src/features/bot/components/settings/registry/ProviderItem.tsx
// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";
import { useProvider } from "@/features/bot/hooks";
import { BaseProvider } from "@/features/bot/components/base";

interface ProviderItemProps {
  item: ProviderRegistryEntry;
}

export const ProviderItem = ({ item }: ProviderItemProps) => {
  const provider = useProvider(item.id);

  return <BaseProvider {...provider} icon={item.icon} />;
};
