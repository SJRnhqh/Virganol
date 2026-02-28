// apps/ui/src/features/bot/components/settings/LLMProviders.tsx
// 内部引用
import { ProviderHeader } from "./ProviderHeader";
import { ProviderList } from "./registry";

export const LLMProviders = () => {
  return (
    <div className="w-full p-1 max-w-3xl mx-auto text-settings-panel-fg">
      <ProviderHeader />

      <div className="border border-settings-panel-border/20 rounded-lg bg-settings-panel-inner-bg shadow-sm overflow-hidden divide-y divide-settings-panel-border/30">
        <ProviderList />
      </div>
    </div>
  );
};
