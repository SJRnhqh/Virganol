// apps/ui/src/features/bot/types/provider/props/info.ts

// 外部依赖
import type { ReactNode } from "react";

// 内部引用
import type { WithProviderId } from "./id";

/**
 * Provider 静态信息：包含身份和展示用信息。
 * 用于需要 provider id、名称和图标的组件。
 */
export interface ProviderInfo extends WithProviderId {
  name: string;
  icon: ReactNode;
}
