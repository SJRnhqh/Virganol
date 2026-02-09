// apps/ui/src/features/bot/components/settings/providers/ProviderList.tsx
// 内部引用
import { PROVIDER_REGISTRY } from "@/features/bot/components/settings/registry";
import { ProviderItem } from "./ProviderItem";

export const ProviderList = () => {
  return (
    <>
      {PROVIDER_REGISTRY.map((provider) => (
        <ProviderItem
          key={provider.id}
          providerId={provider.id}
          icon={provider.icon}
        />
      ))}
    </>
  );
};
