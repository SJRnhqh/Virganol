// apps/ui/src/features/bot/components/settings/registry/ProviderItem.tsx
// 内部引用
import { BaseProvider } from "../../base/BaseProvider";
import { useProvider } from "../../../hooks/providers";
import type { ProviderRegistryEntry } from "../../../types/providers";

interface ProviderItemProps {
  item: ProviderRegistryEntry;
}

export const ProviderItem = ({ item }: ProviderItemProps) => {
  const provider = useProvider(item.id);

  return <BaseProvider {...provider} icon={item.icon} />;
};
