// apps/ui/src/features/bot/hooks/provider/useProviderConnectedPanel.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId } from "@/features/bot/types";
import { useProviderModelActions } from "./useProviderModelActions";

type ProviderModelSelectionState = "off" | "on" | "mixed";

interface UseProviderConnectedPanelParams {
  providerId: ProviderId;
}

interface ConnectedModelItem {
  name: string;
  checked: boolean;
}

interface UseProviderConnectedPanelResult {
  hasModels: boolean;
  modelItems: ConnectedModelItem[];
  selectionState: ProviderModelSelectionState;
  masterAriaChecked: boolean | "mixed";
  onToggleModel: (model: string) => void;
  onToggleAllModels: () => void;
}

export const useProviderConnectedPanel = ({
  providerId,
}: UseProviderConnectedPanelParams): UseProviderConnectedPanelResult => {
  const { available, enabled, onToggle, onToggleAll } =
    useProviderModelActions(providerId);

  const modelItems: ConnectedModelItem[] = available.map((model) => ({
    name: model,
    checked: enabled[model],
  }));
  const hasModels = modelItems.length > 0;

  const enabledCount = modelItems.reduce(
    (count, model) => count + (model.checked ? 1 : 0),
    0,
  );

  const selectionState: ProviderModelSelectionState =
    !hasModels || enabledCount === 0
      ? "off"
      : enabledCount === modelItems.length
        ? "on"
        : "mixed";

  const masterAriaChecked: boolean | "mixed" =
    selectionState === "mixed" ? "mixed" : selectionState === "on";

  const handleToggleModel = useCallback(
    (model: string) => {
      onToggle(model, !enabled[model]);
    },
    [enabled, onToggle],
  );

  const handleToggleAllModels = useCallback(() => {
    onToggleAll(selectionState !== "on");
  }, [onToggleAll, selectionState]);

  return {
    hasModels,
    modelItems,
    selectionState,
    masterAriaChecked,
    onToggleModel: handleToggleModel,
    onToggleAllModels: handleToggleAllModels,
  };
};
