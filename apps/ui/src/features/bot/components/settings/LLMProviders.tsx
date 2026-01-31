// TODO：优化样式语义化
import { useState } from "react";
import {
  OllamaProvider,
  DeepseekProvider,
} from "@/features/bot/components/settings/providers";
import {
  type OllamaConfig,
  type DeepseekConfig,
  DEFAULT_PROVIDER_CONFIG,
} from "@/features/bot/types/llmProviders";

export const LLMProviders = () => {
  // Provider 配置受控状态（用集中默认值）
  const [ollamaConfig, setOllamaConfig] = useState<OllamaConfig>(
    DEFAULT_PROVIDER_CONFIG.ollama,
  );
  const [deepseekConfig, setDeepseekConfig] = useState<DeepseekConfig>(
    DEFAULT_PROVIDER_CONFIG.deepseek,
  );

  // 折叠受控状态
  const [openOllama, setOpenOllama] = useState(false);
  const [openDeepseek, setOpenDeepseek] = useState(false);

  return (
    <div className="w-full h-full p-2 max-w-3xl mx-auto text-[#5b4913]">
      <div className="mb-3 px-1">
        <h2 className="text-lg font-bold tracking-tight text-[#5b4913]">
          LLM Providers
        </h2>
      </div>

      <div className="border border-[#5b4913]/20 rounded-lg bg-[#5b4913]/5 shadow-sm overflow-hidden divide-y divide-[#5b4913]/5">
        <OllamaProvider
          value={ollamaConfig}
          onChange={setOllamaConfig}
          open={openOllama}
          onOpenChange={setOpenOllama}
        />

        <DeepseekProvider
          value={deepseekConfig}
          onChange={setDeepseekConfig}
          open={openDeepseek}
          onOpenChange={setOpenDeepseek}
        />
      </div>
    </div>
  );
};
