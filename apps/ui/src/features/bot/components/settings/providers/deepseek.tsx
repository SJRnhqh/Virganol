import { DeepSeek as DeepSeekIcon } from "@lobehub/icons";
import type { ProviderRegistryEntry } from "./types";

export const deepseekProvider = {
  id: "deepseek",
  icon: <DeepSeekIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
