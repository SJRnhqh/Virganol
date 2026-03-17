// apps/ui/src/features/bot/types/provider/base.ts
// 内部引用
import type { ProviderFormData } from "./state";

/** 连接操作（仅暴露组件层需要的操作） */
export interface ProviderConnectionProps {
  onConnect?: (formData: ProviderFormData) => Promise<void>;
  onErrorReset?: () => void;
}
