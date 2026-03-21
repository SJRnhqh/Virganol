// apps/ui/src/features/bot/constants/provider/config/form.ts
// 内部引用
import type {
  ProviderId,
  ProviderFormData,
  ProviderFormProps,
  ProviderFormVariantConfig,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";

/** Provider 表单字段初始值（用于 store 初始化） */
export const PROVIDER_INITIAL_FORMS: Record<ProviderId, ProviderFormData> = {
  ollama: { apiURL: "http://localhost:11434", apiKey: "" },
  lmstudio: { apiURL: "http://localhost:1234", apiKey: "" },
  deepseek: { apiKey: "" },
  qwen: { apiKey: "" },
  doubao: { apiKey: "" },
  minimax: { apiKey: "" },
  zhipu: { apiKey: "" },
  kimi: { apiKey: "" },
  wenxin: { apiKey: "" },
  hunyuan: { apiKey: "" },
};

/** Provider 表单状态变体配置 */
export const PROVIDER_FORM_VARIANTS = {
  [PROVIDER_CARD_STATES.UNSET]: {
    disabled: false,
    labelClassName:
      "text-[10px] uppercase tracking-widest text-settings-panel-fg/60 font-bold ml-1 select-none",
    inputClassName:
      "w-full bg-settings-panel-fg/10 text-settings-panel-fg border-none rounded-lg px-3.5 py-2.5 text-xs font-mono placeholder:text-settings-panel-fg/40 shadow-inner focus:outline-none focus:bg-settings-panel-fg/15 focus:ring-1 focus:ring-settings-panel-fg/20 transition-all duration-200",
    optionalClassName:
      "text-settings-panel-fg/40 font-normal normal-case tracking-normal ml-1",
  },
  [PROVIDER_CARD_STATES.PENDING]: {
    disabled: true,
    labelClassName:
      "text-[10px] uppercase tracking-widest text-settings-panel-fg/40 font-bold ml-1 select-none",
    inputClassName:
      "w-full bg-settings-panel-fg/10 text-settings-panel-fg/40 border-none rounded-lg px-3.5 py-2.5 text-xs font-mono cursor-not-allowed animate-pulse",
    optionalClassName:
      "text-settings-panel-fg/30 font-normal normal-case tracking-normal ml-1",
  },
} satisfies Record<ProviderFormProps["cardState"], ProviderFormVariantConfig>;
