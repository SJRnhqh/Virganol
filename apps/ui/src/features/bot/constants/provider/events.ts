// apps/ui/src/features/bot/constants/events.ts
// Provider 生命周期事件名（与 Rust 后端 emit 名称保持一致）
export const PROVIDER_CHECK_EVENTS = {
  STARTED: "providers-check-lifecycle-started",
  PROVIDER_STATUS: "provider-status",
  COMPLETED: "providers-check-lifecycle-completed",
  FAILED: "providers-check-lifecycle-failed",
} as const;

/** Provider 生命周期阶段转换延迟（毫秒） */
export const PROVIDER_CHECK_DELAYS = {
  /** checking → 终态补足延迟 */
  CHECKING_DONE: 800,
  /** done → idle 回归延迟 */
  DONE_IDLE: 1200,
  /** failed → idle 回归延迟 */
  FAILED_IDLE: 3500,
} as const;
