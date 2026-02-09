// apps/ui/src/features/bot/components/settings/providers/ProviderItem.tsx
// 外部依赖
import type { ReactNode } from "react";

// 内部引用
import { BaseProvider } from "../../base/BaseProvider";
import { useProvider } from "@/features/bot/hooks/useProvider";
import type { ProviderId } from "@/features/bot/types/llmProviders";

interface ProviderItemProps {
  providerId: ProviderId;
  icon: ReactNode;
}

export const ProviderItem = ({ providerId, icon }: ProviderItemProps) => {
  const provider = useProvider(providerId);

  return <BaseProvider {...provider} icon={icon} />;
};
