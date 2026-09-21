// apps/ui/src/types/state/disclosure.ts

/** Updater of the disclosure state.
 *
 * 开合状态的更新器。
 */
export type DisclosureUpdater = (
  updater:
    | Partial<DisclosureState>
    | ((state: DisclosureState) => Partial<DisclosureState>),
) => void;

/** Disclosure state.
 *
 * 开合状态。
 */
export interface DisclosureState {
  /** Whether it is currently open.
   *
   * 当前是否展开。
   */
  isOpen: boolean;
  /** Opens.
   *
   * 展开。
   */
  open: () => void;
  /** Closes.
   *
   * 收起。
   */
  close: () => void;
  /** Toggles between open and closed.
   *
   * 切换展开与收起。
   */
  toggle: () => void;
}
