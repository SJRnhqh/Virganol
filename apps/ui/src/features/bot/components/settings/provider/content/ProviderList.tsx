// apps/ui/src/features/bot/components/settings/provider/content/ProviderList.tsx
// 内部引用
import { PROVIDER_IDS } from "@/features/bot/constants";
import { PROVIDER_ICONS } from "@/features/bot/icons";
import { ProviderItem } from "./ProviderItem";

export const ProviderList = () => {
  return (
    <>
      {PROVIDER_IDS.map((providerId) => (
        <ProviderItem
          key={providerId}
          providerId={providerId}
          icon={PROVIDER_ICONS[providerId]}
        />
      ))}
    </>
  );
};
