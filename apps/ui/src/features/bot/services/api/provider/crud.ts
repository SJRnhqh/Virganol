// apps/ui/src/features/bot/services/api/provider/crud.ts
// 外部依赖
import { invoke } from "@tauri-apps/api/core";

// 内部引用
import type {
  ConnectAndSaveProviderPayload,
  HealthCheckResponse,
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
          ...(url && { url }),
        },
      },
    );
    const ms = (performance.now() - startTime).toFixed(2);
    if (response.success) {
      console.log(
        `[React] connect_and_save ${providerId} ✅ (${ms}ms)`,
        response.available_models,
      );
    } else {
      console.error(
        `[React] connect_and_save ${providerId} ❌ (${ms}ms):`,
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
