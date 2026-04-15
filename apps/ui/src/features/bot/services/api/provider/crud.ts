// apps/ui/src/features/bot/services/api/provider/crud.ts
// 外部依赖
import { invoke } from "@tauri-apps/api/core";

// 内部引用
import type {
  ConnectAndSaveProviderPayload,
  ConnectAndSaveProviderResponse,
  ProviderId,
} from "@/features/bot/types";

/** 接入新 Provider：健康检查 + 成功则持久化 */
export const connectAndSaveProvider = async ({
  providerId,
  key,
  url,
}: ConnectAndSaveProviderPayload): Promise<ConnectAndSaveProviderResponse> => {
  const startTime = performance.now();
  try {
    const response = await invoke<ConnectAndSaveProviderResponse>(
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
        response.availableModels,
      );
    } else {
      console.error(
        `[React] connect_and_save ${providerId} ❌ (${ms}ms):`,
        response.error,
      );
    }
    return response;
    // TODO: 全链路错误精细化管理 — invoke 异常被吞并为 { success: false }，
    //   前端无法区分业务失败与 IPC 系统级异常，待 Phase 6.1 统一处理。
  } catch (error) {
    const ms = (performance.now() - startTime).toFixed(2);
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[API] connect_and_save invoke error (${ms}ms):`, msg);
    return {
      success: false,
      availableModels: [],
      enabledModels: [],
      error: msg,
    };
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
