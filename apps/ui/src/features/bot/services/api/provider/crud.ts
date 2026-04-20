// apps/ui/src/features/bot/services/api/provider/crud.ts
// 外部依赖
import { invoke } from "@tauri-apps/api/core";

// 内部引用
import type {
  ConnectAndSaveProviderResponse,
  ConnectAndSaveProviderPayload,
  MutationResponse,
  ResetProviderResponse,
  UpdateEnabledModelsPayload,
  UpdateEnabledModelsResponse,
  ProviderId,
} from "@/features/bot/types";

// ============ 装饰器工厂：统一错误处理和日志 ============
const withErrorHandling = <TPayload, TResponse extends MutationResponse>(
  command: string,
  preparePayload: (input: TPayload) => Record<string, unknown>,
  getOperationName: (input: TPayload) => string,
  createErrorResponse: (error: string) => TResponse,
) => {
  return async (input: TPayload): Promise<TResponse> => {
    const startTime = performance.now();

    try {
      const payload = preparePayload(input);
      const response = await invoke<TResponse>(command, payload);
      const ms = (performance.now() - startTime).toFixed(2);
      const name = getOperationName(input);

      if (response.success) {
        console.log(`[API] ${name} ✅ (${ms}ms)`);
      } else {
        console.error(`[API] ${name} ❌ (${ms}ms):`, response.error);
      }

      return response;
    } catch (error) {
      const ms = (performance.now() - startTime).toFixed(2);
      const msg = error instanceof Error ? error.message : String(error);
      const name = getOperationName(input);
      console.error(`[API] ${name} invoke error (${ms}ms):`, msg);
      return createErrorResponse(msg);
    }
  };
};

// ============ Provider CRUD 操作 ============

/** 接入新 Provider：健康检查 + 成功则持久化 */
export const connectAndSaveProvider = withErrorHandling<
  ConnectAndSaveProviderPayload,
  ConnectAndSaveProviderResponse
>(
  "connect_and_save_provider",
  (input) => ({
    payload: {
      providerId: input.providerId,
      key: input.key,
      ...(input.url && { url: input.url }),
    },
  }),
  (input) => `connect_and_save ${input.providerId}`,
  (error) => ({
    success: false,
    availableModels: [],
    enabledModels: [],
    error,
  }),
);

/** 重置一个 Provider 的持久化配置 */
export const resetProvider = withErrorHandling<
  ProviderId,
  ResetProviderResponse
>(
  "reset_provider",
  (providerId) => ({ providerId }),
  (providerId) => `reset_provider ${providerId}`,
  (error) => ({ success: false, error }),
);

/** 更新某个 Provider 的 enabled_models */
export const updateEnabledModels = withErrorHandling<
  UpdateEnabledModelsPayload,
  UpdateEnabledModelsResponse
>(
  "update_enabled_models",
  (input) => ({
    payload: {
      providerId: input.providerId,
      enabledModels: input.enabledModels,
    },
  }),
  (input) => `update_enabled_models ${input.providerId}`,
  (error) => ({ success: false, error }),
);
