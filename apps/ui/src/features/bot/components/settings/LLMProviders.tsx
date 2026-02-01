// apps/ui/src/features/bot/components/settings/LLMProviders.tsx
// 内部引用
import {
  ProviderPanel,
  PROVIDER_REGISTRY,
} from "@/features/bot/components/settings/providers";

export const LLMProviders = () => {
  return (
    <div className="w-full p-1 max-w-3xl mx-auto text-settings-panel-fg">
      <div className="mb-3 px-1">
        <h2 className="text-lg font-bold tracking-tight">LLM Providers</h2>
      </div>

      <div className="border border-settings-panel-border/20 rounded-lg bg-settings-panel-inner-bg shadow-sm overflow-hidden divide-y divide-settings-panel-border/30">
        {PROVIDER_REGISTRY.map((provider) => (
          <ProviderPanel
            key={provider.id}
            providerId={provider.id}
            icon={provider.icon}
          />
        ))}
      </div>
    </div>
  );
};
