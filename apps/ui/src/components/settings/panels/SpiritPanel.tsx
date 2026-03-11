// apps/ui/src/components/settings/panels/SpiritPanel.tsx
// 内部引用
import { LLMProviders } from "@/features/bot/components";

export const SpiritPanel = () => {
  return (
    <div className="w-full h-full max-w-4xl mx-auto">
      {/* 单层外框：牛皮缝线风格 */}
      <div className="rounded-2xl border-2 border-dashed border-settings-panel-border/60 bg-settings-panel-outer-bg shadow-sm p-3 sm:p-4">
        <LLMProviders />
      </div>
    </div>
  );
};
