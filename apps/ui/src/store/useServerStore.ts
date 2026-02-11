type ServerStoreState = {
  toggleSettings: (isOpen: boolean) => void;
};

const placeholderState: ServerStoreState = {
  toggleSettings: () => undefined,
};

export const useServerStore = <T>(
  selector: (state: ServerStoreState) => T,
): T => {
  // TODO: Replace with real server/settings store implementation.
  return selector(placeholderState);
};
