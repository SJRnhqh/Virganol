// apps/ui/src/store/createDisclosure.ts
import type { DisclosureUpdater } from "@/types";

/** Factory for the disclosure state.
 *
 * 开合状态的工厂。
 */
export function createDisclosure(set: DisclosureUpdater) {
  return {
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  };
}
