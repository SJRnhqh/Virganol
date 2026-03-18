// apps/ui/src/features/bot/hooks/provider/useProviderConnectedPanel.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId } from "@/features/bot/types";
import { useProviderModelActions } from "./useProviderModelActions";

interface ConnectedModelItem {
  name: string;
  checked: boolean;
}

interface UseProviderConnectedPanelResult {
  modelItems: ConnectedModelItem[];
  allSelected: boolean;
  onToggleModel: (model: string) => void;
  onToggleAllModels: () => void;
}

export const useProviderConnectedPanel = (
  providerId: ProviderId,
): UseProviderConnectedPanelResult => {
  const { available, enabled, onToggle, onToggleAll } =
    useProviderModelActions(providerId);

  const modelItems: ConnectedModelItem[] = available.map((model) => ({
    name: model,
    checked: enabled[model],
  }));

  const enabledCount = modelItems.reduce(
    (count, model) => count + (model.checked ? 1 : 0),
    0,
  );

  const allSelected = enabledCount === modelItems.length;

  const handleToggleModel = useCallback(
    (model: string) => {
      onToggle(model, !enabled[model]);
    },
    [enabled, onToggle],
  );

  const handleToggleAllModels = useCallback(() => {
    onToggleAll(!allSelected);
  }, [allSelected, onToggleAll]);

  return {
    modelItems,
    allSelected,
    onToggleModel: handleToggleModel,
    onToggleAllModels: handleToggleAllModels,
  };
};
