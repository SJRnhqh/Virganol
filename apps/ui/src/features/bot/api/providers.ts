// apps/ui/src/features/bot/api/providers.ts
import { invoke } from "@tauri-apps/api/core";
import type {
  ConnectAndSaveProviderPayload,
  HealthCheckResponse,
  ProviderId,
} from "@/features/bot/types";

/** 接入新 Provider：健康检查 + 成功则持久化 */
export const connectAndSaveProvider = async ({
  providerId,
  key,
  url,
}: ConnectAndSaveProviderPayload): Promise<HealthCheckResponse> => {
  const startTime = performance.now();
  try {
    const response = await invoke<HealthCheckResponse>(
      "connect_and_save_provider",
      {
        payload: {
          providerId,
          key,
          ...(url !== undefined ? { url } : {}),
        },
      },
    );
    const ms = (performance.now() - startTime).toFixed(2);
    if (response.success) {
      console.log(
        `[API] connect_and_save ${providerId} ✅ (${ms}ms)`,
        response.available_models,
      );
    } else {
      console.error(
        `[API] connect_and_save ${providerId} ❌ (${ms}ms):`,
        response.error,
      );
    }
    return response;
  } catch (error) {
    const ms = (performance.now() - startTime).toFixed(2);
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[API] connect_and_save invoke error (${ms}ms):`, msg);
    return { success: false, available_models: [], error: msg };
  }
};

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
