// apps/ui/src/features/bot/hooks/provider/data/useProviderModels.ts
// 外部依赖
import { useShallow } from "zustand/react/shallow";

// 内部引用
import type { ProviderId } from "@/features/bot/types";
import { useProviderCollectionStore } from "@/features/bot/store";

export const useProviderModels = (providerId: ProviderId) => {
  // 订阅模型数据（useShallow 浅比较，available/enabled 同时变更只触发一次渲染）
  const { available, enabled } = useProviderCollectionStore(
    useShallow((s) => s.byId[providerId].models),
  );

  // 组装组件所需的模型列表（含选中状态）
  const modelItems = available.map((model) => ({
    name: model,
    checked: enabled[model],
  }));

  // 派生全选状态（every 短路，遇第一个未选中立即返回）
  const allSelected = available.every((model) => enabled[model]);

  return {
    modelItems,
    allSelected,
  };
};
