// apps/ui/src/features/bot/types/provider/state/phase.ts

/**
 * 生命周期业务完成终态（后端正常结束，含部分失败）：
 * - `done`：所有 provider 检查通过
 * - `degraded`：流程正常结束，但存在部分 provider 连接失败（业务性失败，非流程结构性错误）
 */
export type CheckTerminalPhase = "done" | "degraded";

/** 生命周期终态（业务完成终态 + 结构性错误） */
export type TerminalPhase = CheckTerminalPhase | "failed";

/** Provider 生命周期阶段（前端状态机） */
export type ProviderCheckPhase = "idle" | "checking" | TerminalPhase;
