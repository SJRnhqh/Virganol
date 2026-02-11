// apps/ui/src/features/bot/api/providers.ts
import { invoke } from "@tauri-apps/api/core";
import type {
  ConnectProviderRequest,
  ConnectProviderResponse,
  ProviderId,
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
