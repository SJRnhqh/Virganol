// apps/ui/src/features/bot/constants/provider/lifecycle/delays.ts

/** Provider 生命周期阶段转换延迟（毫秒） */
export const PROVIDER_CHECK_DELAYS = {
  /** checking → 终态补足延迟 */
  CHECKING_DONE: 800,
  /** done → idle 回归延迟 */
  DONE_IDLE: 1200,
  /** degraded → idle 回归延迟 */
  DEGRADED_IDLE: 2200,
  /** failed → idle 回归延迟 */
  FAILED_IDLE: 3500,
} as const;
