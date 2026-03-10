// apps/ui/src/features/bot/constants/provider/lifecycle/events.ts
// 内部引用
import type { ProviderCheckEvent } from "@/features/bot/types";

/** Provider 生命周期事件名常量（与 Rust 后端 emit 名称保持一致） */
export const PROVIDER_CHECK_EVENTS = {
  STARTED: "providers-check-lifecycle-started",
  PROVIDER_STATUS: "provider-status",
  COMPLETED: "providers-check-lifecycle-completed",
  FAILED: "providers-check-lifecycle-failed",
} as const satisfies Record<string, ProviderCheckEvent>;
