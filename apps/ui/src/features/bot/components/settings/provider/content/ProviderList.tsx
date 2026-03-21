// apps/ui/src/features/bot/components/settings/provider/content/ProviderList.tsx
// 内部引用
import { PROVIDER_IDS } from "@/features/bot/constants";
import { ProviderItem } from "./cards";

export const ProviderList = () => {
  return (
    <>
      {PROVIDER_IDS.map((providerId) => (
        <ProviderItem key={providerId} id={providerId} />
      ))}
    </>
  );
};
