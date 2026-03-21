// apps/ui/src/features/bot/types/provider/contract/record.ts

/** 对应 Rust ProviderRecord */
export interface ProviderRecord {
  url?: string;
  enabled_models: string[];
}
