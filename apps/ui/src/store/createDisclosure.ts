// apps/ui/src/store/createDisclosure.ts
import type { DisclosureState, DisclosureUpdater } from "@/types";

/** Factory for the disclosure state.
 *
 * 开合状态的工厂。
 */
export function createDisclosure(
  updater: DisclosureUpdater
): Pick<DisclosureState, "open" | "close" | "toggle"> {
  return {
    open: () => updater({ isOpen: true }),
    close: () => updater({ isOpen: false }),
    toggle: () => updater((value) => ({ isOpen: !value.isOpen })),
  };
}
