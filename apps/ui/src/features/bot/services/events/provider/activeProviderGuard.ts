// 内部引用
import { PROVIDER_IDS } from "@/features/bot/constants";
import type { ProviderId } from "@/features/bot/types";

/**
 * 当前运行时启用的 Provider ID。
 *
 * 临时防御性脚手架：当前阶段仅开放 deepseek / ollama，
 * 但全量 Provider 定义仍需保留，供后续分批恢复生命周期与 CRUD 能力。
 * 事件层在消费后端 payload 时，先收窄到运行时白名单，避免宽类型直接渗透到当前主线代码。
 */
export type ActiveProviderId = (typeof PROVIDER_IDS)[number];

export function isActiveProviderId(
  providerId: ProviderId,
): providerId is ActiveProviderId {
  return (PROVIDER_IDS as readonly ProviderId[]).includes(providerId);
}
