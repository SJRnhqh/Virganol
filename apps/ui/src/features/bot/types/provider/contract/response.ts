// apps/ui/src/features/bot/types/provider/contract/response.ts

/**
 * Provider 写入类操作（connect / reset / update）的通用响应契约。
 *
 * 对应后端 `ConnectAndSaveProviderResponse` / `ResetProviderResponse`
 * / `UpdateEnabledModelsResponse` 共享的成功语义与可选错误文案。
 *
 * 具体操作响应通过 `extends MutationResponse` 或 `type X = MutationResponse`
 * 复用基础形状；未来若后端扩展（如 warning / requestId）单点改动即可。
 */
export interface MutationResponse {
  success: boolean;
  error?: string;
}
