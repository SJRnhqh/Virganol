// apps/ui/src/features/bot/services/api/providers.ts
import { invoke } from "@tauri-apps/api/core";
import type { ProviderId } from "@/features/bot/types";

/** 重置一个 Provider 的持久化配置 */
export const resetProvider = async (
  providerId: ProviderId,
): Promise<boolean> => {
  try {
    const result = await invoke<boolean>("reset_provider", { providerId });
    console.log(`[API] reset_provider ${providerId}:`, result);
    return result;
  } catch (error) {
    console.error("[API] reset_provider error:", error);
    return false;
  }
};

/** 更新某个 Provider 的 enabled_models */
export const updateEnabledModels = async (
  providerId: ProviderId,
  enabledModels: string[],
): Promise<boolean> => {
  try {
    const result = await invoke<boolean>("update_enabled_models", {
      providerId,
      enabledModels,
    });
    console.log(`[API] update_enabled_models ${providerId}:`, result);
    return result;
  } catch (error) {
    console.error("[API] update_enabled_models error:", error);
    return false;
  }
};
