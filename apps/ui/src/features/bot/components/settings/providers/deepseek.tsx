import { DeepSeek as DeepSeekIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";

export const DeepseekProvider = () => (
  <BaseProvider
    definition={PROVIDER_DEFINITIONS.deepseek}
    icon={<DeepSeekIcon className="w-5 h-5" />}
  />
);
