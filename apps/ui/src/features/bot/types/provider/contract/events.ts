// apps/ui/src/features/bot/types/provider/contract/events.ts
// 内部引用
import type { ProviderId } from "../common";
import type { ProviderSecretMeta } from "./secret";
import type { ProviderRecord } from "./shared";
import type { HealthCheckResponse } from "./commands";

// ---------------------------------------------------------------------------
// Provider Check Lifecycle — 生命周期事件推送相关类型
// ---------------------------------------------------------------------------

export type ProviderCheckTrigger = "startup" | "manual_refresh";

/** 对应 Rust ProviderIssue — 定位到具体 Provider 的问题 */
export interface ProviderIssue {
  /** 问题所属的 Provider */
  provider: ProviderId;
  /** 结构化问题编码 */
  code: string;
  /** 面向展示的问题描述 */
  message: string;
}

/** 对应 Rust ProviderCheckStartedPayload — 生命周期开始事件 */
export interface ProviderCheckStartedPayload {
  /** 本轮检查唯一标识，关联 started/status/completed 事件 */
  run_id: string;
  /** 本轮检查的触发来源 */
  trigger: ProviderCheckTrigger;
}

/** 对应 Rust ProviderStatusPayload — 逐个 Provider 推送的状态事件 */
export interface ProviderStatusPayload {
  /** 本轮检查唯一标识，关联 started/status/completed 事件 */
  run_id: string;
  /** 当前状态所属的 Provider */
  provider: ProviderId;
  /** 已持久化的配置快照 */
  config: ProviderRecord;
  /** 健康检查结果 */
  health: HealthCheckResponse;
  /** 去敏密钥元信息 */
  secret_meta: ProviderSecretMeta;
}

/** 对应 Rust ProviderCheckCompletedPayload — 生命周期正常结束事件 */
export interface ProviderCheckCompletedPayload {
  /** 本轮检查唯一标识，关联 started/status/completed 事件 */
  run_id: string;
  /** 健康检查失败数量 */
  failed: number;
}

/** 对应 Rust ProviderCheckFailedPayload — 生命周期异常终止事件 */
export interface ProviderCheckFailedPayload {
  /** 本轮检查唯一标识，关联 started/status/failed 事件 */
  run_id: string;
  /** 结构化错误码 */
  code: string;
  /** 面向展示或日志的错误信息 */
  message: string;
  /** Provider 级问题列表，仅在可定位到具体 Provider 时存在 */
  issues?: ProviderIssue[];
}
