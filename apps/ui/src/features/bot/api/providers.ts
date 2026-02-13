// apps/ui/src/features/bot/api/providers.ts
import { invoke } from "@tauri-apps/api/core";
import type {
  HealthCheckResponse,
  ProviderId,
} from "@/features/bot/types";

/** 触发后端检查所有已持久化的 Provider（配合 listen 使用） */
export const triggerProvidersStartupCheck = async (): Promise<void> => {
  try {
    await invoke("trigger_providers_startup_check");
  } catch (error) {
    console.error("[API] trigger_providers_startup_check error:", error);
  }
};

/** 接入新 Provider：健康检查 + 成功则持久化 */
export const connectAndSaveProvider = async (
  providerId: ProviderId,
  url: string = "",
  key: string = "",
): Promise<HealthCheckResponse> => {
  const startTime = performance.now();
  try {
    const response = await invoke<HealthCheckResponse>("connect_and_save_provider", {
      providerId,
      url,
      key,
    });
    const ms = (performance.now() - startTime).toFixed(2);
    if (response.success) {
      console.log(`[API] connect_and_save ${providerId} ✅ (${ms}ms)`, response.available_models);
    } else {
      console.error(`[API] connect_and_save ${providerId} ❌ (${ms}ms):`, response.error);
    }
    return response;
  } catch (error) {
    const ms = (performance.now() - startTime).toFixed(2);
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[API] connect_and_save invoke error (${ms}ms):`, msg);
    return { success: false, available_models: [], error: msg };
  }
};

/** 删除一个 Provider 的持久化配置 */
export const removeProvider = async (providerId: string): Promise<boolean> => {
  try {
    const result = await invoke<boolean>("remove_provider", { providerId });
    console.log(`[API] remove_provider ${providerId}:`, result);
    return result;
  } catch (error) {
    console.error("[API] remove_provider error:", error);
    return false;
  }
};