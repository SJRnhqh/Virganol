// apps/ui/src/features/bot/types/provider/state/phase.ts

/** 生命周期业务完成终态（后端正常结束，含部分失败） */
export type CheckTerminalPhase = "done" | "degraded";

/** 生命周期终态（业务完成终态 + 结构性错误） */
export type TerminalPhase = CheckTerminalPhase | "failed";

/** Provider 生命周期阶段（前端状态机） */
export type ProviderCheckPhase = "idle" | "checking" | TerminalPhase;
