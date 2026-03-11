// apps/ui/src/features/bot/components/settings/registry/ProviderItem.tsx
// 内部引用
import type { ProviderId } from "@/features/bot/types";
import { useProvider } from "@/features/bot/hooks";
import { BaseProvider } from "@/features/bot/components/base";

interface ProviderItemProps {
  providerId: ProviderId;
  icon: React.ReactNode;
}

export const ProviderItem = ({ providerId, icon }: ProviderItemProps) => {
  const provider = useProvider(providerId);

  return <BaseProvider {...provider} icon={icon} />;
};
