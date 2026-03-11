// apps/ui/src/features/bot/types/provider/props/meta.ts

/**
 * Provider 元数据 Props：包含展示用的静态信息
 * 用于需要 provider 名称和图标的组件
 */
export interface WithProviderMeta {
  name: string;
  icon: React.ReactNode;
}
