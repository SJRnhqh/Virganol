// apps/ui/src/features/bot/types/provider/contract/commands.ts

/** 对应 Rust HealthCheckResult（内部健康检查结果） */
export interface HealthCheckResult {
  success: boolean;
  available_models: string[];
  // TODO: 若后续统一业务错误模型，评估收敛为结构化 code/message 契约，避免长期停留在宽泛字符串。
  error?: string;
}
