// apps/ui/src/features/bot/services/events/provider/handlers/validators/cardStateGuard.ts
// 内部引用
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { useProviderCollectionStore } from "@/features/bot/store";
import type { ActiveProviderId } from "./activeProviderGuard";

/**
 * 判断卡片当前是否由用户主动操作占用，不应被 lifecycle 事件抢占。
 *
 * PENDING 态代表用户正在发起 connect（form 已 disabled + store 的 isPending 锁），
 * 此时 lifecycle 推送的 provider-status 若覆盖 cardState / models，会在视觉上
 * 造成 "pending → connected → pending → connected" 的闪烁。
 *
 * 与 `runGuard` / `activeProviderGuard` 同层同语义：只读、只判断、无副作用。
 */
export function isCardBusyForLifecycle(provider: ActiveProviderId): boolean {
  const { cardState } = useProviderCollectionStore.getState().byId[provider];
  return cardState === PROVIDER_CARD_STATES.PENDING;
}
