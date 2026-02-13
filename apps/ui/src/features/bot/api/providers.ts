// apps/ui/src/features/bot/api/providers.ts
import { invoke } from "@tauri-apps/api/core";
import type {
  ConnectProviderRequest,
  ConnectProviderResponse,
  ProviderId,
  HealthCheckResponse,
} from "@/features/bot/types";

/**
 * 连接到指定的 LLM Provider
 * @param providerId - Provider ID (ollama, deepseek 等)
 * @param config - Provider 配置对象
 * @returns 连接结果
 * @throws 如果连接失败会抛出错误
 */
export const connectProvider = async (
  providerId: ProviderId,
  config: Record<string, string>,
): Promise<ConnectProviderResponse> => {
  const startTime = performance.now();

  try {
    // 构建请求对象，确保类型安全
    const request: ConnectProviderRequest = {
      provider_id: providerId,
      config,
    };

    // 调用 Tauri 后端的 connect_provider command
    const response = await invoke<ConnectProviderResponse>("connect_provider", {
      request,
    });

    const endTime = performance.now();
    const responseTime = (endTime - startTime).toFixed(2);

    if (response.success) {
      console.log(`[API] Connected to ${providerId} (${responseTime}ms)`);
    } else {
      console.error(
        `[API] Failed to connect to ${providerId} (${responseTime}ms): ${response.error}`,
      );
    }

    return response;
  } catch (error) {
    // 处理 Tauri invoke 错误
    const errorMessage = error instanceof Error ? error.message : String(error);
    const endTime = performance.now();
    const responseTime = (endTime - startTime).toFixed(2);

    console.error(
      `[API] Error invoking connect_provider (${responseTime}ms): ${errorMessage}`,
    );

    return {
      success: false,
      error: `Failed to connect to ${providerId}: ${errorMessage}`,
    };
  }
};

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
  providerId: string,
  url: string,
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