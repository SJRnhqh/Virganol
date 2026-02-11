type ServerStoreState = {
  toggleSettings: (isOpen: boolean) => void;
};

let hasWarnedPlaceholderUsage = false;

const placeholderState: ServerStoreState = {
  toggleSettings: (isOpen) => {
    if (import.meta.env.DEV && !hasWarnedPlaceholderUsage) {
      hasWarnedPlaceholderUsage = true;
      console.warn(
        "[useServerStore] Placeholder store called. toggleSettings is not wired to a real implementation yet.",
        { isOpen },
      );
    }
  },
};

export const useServerStore = <T>(
  selector: (state: ServerStoreState) => T,
): T => {
  // TODO: Replace with real server/settings store implementation.
  return selector(placeholderState);
};
