import { LLMProviders } from "@/features/bot/components/settings/LLMProviders";
// TODO：优化样式语义化
export const SpiritPanel = () => {
  return (
    <div className="w-full h-full p-8 max-w-5xl mx-auto text-[#5b4913]">
      {/* 单层外框：牛皮缝线风格 */}
      <div className="rounded-2xl border-2 border-dashed border-[#5b4913]/30 bg-[#5b4913]/5 shadow-sm p-4 sm:p-5 md:p-6">
        <LLMProviders />
      </div>
    </div>
  );
};
