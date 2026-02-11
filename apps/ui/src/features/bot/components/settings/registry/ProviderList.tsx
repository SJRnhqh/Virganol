// apps/ui/src/features/bot/components/settings/registry/ProviderList.tsx
// 内部引用
import { PROVIDER_REGISTRY } from "../../../constants";
import { ProviderItem } from "./ProviderItem";

export const ProviderList = () => {
  return (
    <>
      {PROVIDER_REGISTRY.map((provider) => (
        <ProviderItem key={provider.id} item={provider} />
      ))}
    </>
  );
};
