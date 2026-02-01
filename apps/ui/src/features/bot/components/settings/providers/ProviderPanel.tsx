import type { ReactNode } from "react";
import { BaseProvider } from "../../base/BaseProvider";
import { useProvider } from "@/features/bot/hooks/useProvider";
import type { ProviderId } from "@/features/bot/types/llmProviders";

interface ProviderPanelProps {
  providerId: ProviderId;
  icon: ReactNode;
}

export const ProviderPanel = ({ providerId, icon }: ProviderPanelProps) => {
  const provider = useProvider(providerId);

  return <BaseProvider {...provider} icon={icon} />;
};
