// apps/ui/src/features/bot/types/provider/contract/secret.ts

// TODO：未导出消费
export type ProviderKeySource = "none" | "env" | "keyring";

/** 对应 Rust ProviderSecretMeta */
export interface ProviderSecretMeta {
  has_key: boolean;
  key_source: ProviderKeySource;
}
