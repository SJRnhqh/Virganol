// apps/desktop/src-tauri/src/core/bot/models/provider/error/internal.rs
use keyring::Error as KeyringError;
use reqwest::Error as ReqwestError;
use serde_json::Error as JsonError;
use tauri::Error as TauriError;
use thiserror::Error;
use tokio::task::JoinError;

use super::super::super::SettingsError;
use super::super::{
    ProviderErrorContext, ProviderExecutionContext, ProviderId, ProviderLifecycleContext,
    ProviderManagerContext,
};

/// Internal domain error for the provider subsystem.
///
/// Provider 子系统的内部领域错误。
#[derive(Error, Debug)]
pub(in crate::core::bot) enum ProviderError {
    /// Provider manager received a command payload without the expected data section.
    ///
    /// Provider manager 收到缺少预期 data 区块的命令载荷。
    #[error("provider manager request payload is absent for {context}")]
    ManagerRequestPayloadAbsent {
        /// Provider manager error attribution context.
        ///
        /// Provider manager 错误归因上下文。
        context: ProviderErrorContext,
    },
    /// Provider check lifecycle started event emission failed.
    ///
    /// Provider 检查生命周期开始事件推送失败。
    #[error("failed to emit provider check started event for {context}: {source}")]
    CheckStartedEmit {
        /// Provider lifecycle error attribution context.
        ///
        /// Provider 生命周期错误归因上下文。
        context: ProviderErrorContext,
        /// Tauri event emission error.
        ///
        /// Tauri 事件推送错误。
        #[source]
        source: TauriError,
    },
    /// Provider check lifecycle status event emission failed.
    ///
    /// Provider 检查生命周期状态事件推送失败。
    #[error("provider check lifecycle status event emission failed: {source}")]
    CheckStatusEmit {
        /// Provider whose status event failed to emit.
        ///
        /// 状态事件推送失败所属的 Provider。
        provider_id: ProviderId,
        /// Tauri event emission error.
        ///
        /// Tauri 事件推送错误。
        #[source]
        source: TauriError,
    },
    /// Provider check lifecycle completed event emission failed.
    ///
    /// Provider 检查生命周期完成事件推送失败。
    #[error("failed to emit provider check completed event for {context}: {source}")]
    CheckCompletedEmit {
        /// Provider lifecycle error attribution context.
        ///
        /// Provider 生命周期错误归因上下文。
        context: ProviderErrorContext,
        /// Tauri event emission error.
        ///
        /// Tauri 事件推送错误。
        #[source]
        source: TauriError,
    },
    /// Provider check lifecycle failed event emission failed.
    ///
    /// Provider 检查生命周期失败事件推送失败。
    #[error("failed to emit provider check failed event for {context}: {source}")]
    CheckFailedEmit {
        /// Provider lifecycle error attribution context.
        ///
        /// Provider 生命周期错误归因上下文。
        context: ProviderErrorContext,
        /// Tauri event emission error.
        ///
        /// Tauri 事件推送错误。
        #[source]
        source: TauriError,
    },
    /// Provider check task join failed.
    ///
    /// Provider 检查任务 join 失败。
    #[error("provider check task join failed: {source}")]
    CheckTaskJoin {
        /// Tokio task join error raised by the concurrent health-check task.
        ///
        /// 并发健康检查任务产生的 Tokio task join 错误。
        #[source]
        source: JoinError,
    },
    /// Provider check collected provider-level errors during lifecycle execution.
    ///
    /// Provider 检查生命周期执行期间收集到了 Provider 级错误。
    #[error("provider check collected provider-level errors")]
    CheckAggregate,
    /// Required health check configuration is missing.
    ///
    /// 健康检查所需配置缺失。
    #[error("provider health check configuration is missing for {provider_id}")]
    HealthCheckMissingConfig {
        /// Provider missing the required health-check configuration.
        ///
        /// 缺少必需健康检查配置的 Provider。
        provider_id: ProviderId,
    },
    /// Health check network connection failed.
    ///
    /// 健康检查网络连接失败。
    #[error("provider health check network request failed: {source}")]
    HealthCheckNetwork {
        /// Provider whose health-check request failed.
        ///
        /// 健康检查请求失败所属的 Provider。
        provider_id: ProviderId,
        /// HTTP client request error.
        ///
        /// HTTP 客户端请求错误。
        #[source]
        source: ReqwestError,
    },
    /// Health check HTTP status indicates failure.
    ///
    /// 健康检查 HTTP 状态码表示失败。
    #[error("provider health check HTTP status indicates failure for {provider_id}")]
    HealthCheckHttp {
        /// Provider whose health-check response returned a failing status.
        ///
        /// 健康检查响应返回失败状态码的 Provider。
        provider_id: ProviderId,
    },
    /// Health check response format is invalid.
    ///
    /// 健康检查响应格式无效。
    #[error("provider health check response format is invalid: {source}")]
    HealthCheckResponseFormat {
        /// Provider whose health-check response could not be parsed.
        ///
        /// 健康检查响应无法解析的 Provider。
        provider_id: ProviderId,
        /// HTTP response decoding error.
        ///
        /// HTTP 响应解码错误。
        #[source]
        source: ReqwestError,
    },
    /// Requested provider has no persisted configuration record.
    ///
    /// 请求的 provider 没有对应的持久化配置记录。
    #[error("provider configuration not found for {context}")]
    ConfigNotFound {
        /// Provider config-store error attribution context.
        ///
        /// Provider 配置存储错误归因上下文。
        context: ProviderErrorContext,
    },
    /// Provider configuration failed to serialize into JSON.
    ///
    /// Provider 配置序列化为 JSON 失败。
    #[error("provider configuration failed to serialize for {context}: {source}")]
    JsonSerialize {
        /// Provider config-store error attribution context.
        ///
        /// Provider 配置存储错误归因上下文。
        context: ProviderErrorContext,
        /// JSON serialization error.
        ///
        /// JSON 序列化错误。
        #[source]
        source: JsonError,
    },
    /// Provider configuration failed to deserialize from JSON.
    ///
    /// Provider 配置从 JSON 反序列化失败。
    #[error("provider configuration failed to deserialize for {context}: {source}")]
    JsonDeserialize {
        /// Provider config-store error attribution context.
        ///
        /// Provider 配置存储错误归因上下文。
        context: ProviderErrorContext,
        /// JSON deserialization error.
        ///
        /// JSON 反序列化错误。
        #[source]
        source: JsonError,
    },
    /// Provider configuration store failed at the Provider settings boundary.
    ///
    /// Provider 配置存储操作在 Provider settings 边界上失败。
    #[error("provider configuration store failed for {context}: {source}")]
    ConfigStore {
        /// Provider config-store error attribution context.
        ///
        /// Provider 配置存储错误归因上下文。
        context: ProviderErrorContext,
        /// Settings-owned store error projected through the boundary.
        ///
        /// 穿过边界投影进来的 settings 存储错误。
        #[source]
        source: SettingsError,
    },

    /// System secret store failed to initialize.
    ///
    /// 系统密钥存储初始化失败。
    #[error("provider secret store could not be initialized: {source}")]
    SecretStoreInit {
        /// Provider whose secret store entry failed to initialize.
        ///
        /// 密钥存储条目初始化失败所属的 Provider。
        provider_id: ProviderId,
        /// Keyring initialization error.
        ///
        /// keyring 初始化错误。
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be written.
    ///
    /// 系统密钥存储无法写入。
    #[error("provider secret store could not be written: {source}")]
    SecretStoreWrite {
        /// Provider whose secret could not be written.
        ///
        /// 密钥无法写入所属的 Provider。
        provider_id: ProviderId,
        /// Keyring write error.
        ///
        /// keyring 写入错误。
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be read.
    ///
    /// 系统密钥存储无法读取。
    #[error("provider secret store could not be read: {source}")]
    SecretStoreRead {
        /// Provider whose secret could not be read.
        ///
        /// 密钥无法读取所属的 Provider。
        provider_id: ProviderId,
        /// Keyring read error.
        ///
        /// keyring 读取错误。
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be removed (delete).
    ///
    /// 系统密钥存储无法删除。
    #[error("provider secret store could not be removed: {source}")]
    SecretStoreRemove {
        /// Provider whose secret could not be removed.
        ///
        /// 密钥无法删除所属的 Provider。
        provider_id: ProviderId,
        /// Keyring remove error.
        ///
        /// keyring 删除错误。
        #[source]
        source: KeyringError,
    },
    /// Provider id from storage is not supported by the current backend.
    ///
    /// 存储中的 provider id 不被当前后端支持。
    #[error("provider is not supported by the current backend: {raw_provider_id}")]
    UnsupportedProvider {
        /// Raw provider id that could not be parsed as a supported backend provider.
        ///
        /// 无法解析为后端支持 Provider 的原始 provider id。
        raw_provider_id: String,
    },
}

impl ProviderError {
    /// Creates a manager payload validation error from the interactive management context.
    ///
    /// 基于交互式管理上下文创建 manager 载荷校验错误。
    pub(in crate::core::bot) fn manager_request_payload_absent(
        ctx: &ProviderManagerContext,
    ) -> Self {
        Self::ManagerRequestPayloadAbsent {
            context: ctx.error_context(),
        }
    }

    /// Creates a lifecycle started event emission error from the lifecycle context.
    ///
    /// 基于生命周期上下文创建 lifecycle started 事件推送错误。
    pub(in crate::core::bot) fn check_started_emit(
        ctx: &ProviderLifecycleContext,
        source: TauriError,
    ) -> Self {
        Self::CheckStartedEmit {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a lifecycle completed event emission error from the lifecycle context.
    ///
    /// 基于生命周期上下文创建 lifecycle completed 事件推送错误。
    pub(in crate::core::bot) fn check_completed_emit(
        ctx: &ProviderLifecycleContext,
        source: TauriError,
    ) -> Self {
        Self::CheckCompletedEmit {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a lifecycle failed event emission error from the lifecycle context.
    ///
    /// 基于生命周期上下文创建 lifecycle failed 事件推送错误。
    pub(in crate::core::bot) fn check_failed_emit(
        ctx: &ProviderLifecycleContext,
        source: TauriError,
    ) -> Self {
        Self::CheckFailedEmit {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a config-not-found error from the execution context.
    ///
    /// 基于执行上下文创建配置缺失错误。
    pub(in crate::core::bot) fn config_not_found(ctx: &ProviderExecutionContext) -> Self {
        Self::ConfigNotFound {
            context: ctx.error_context(),
        }
    }

    /// Creates a provider config serialization error from the execution context.
    ///
    /// 基于执行上下文创建 Provider 配置序列化错误。
    pub(in crate::core::bot) fn json_serialize(
        ctx: &ProviderExecutionContext,
        source: JsonError,
    ) -> Self {
        Self::JsonSerialize {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a provider config deserialization error from the execution context.
    ///
    /// 基于执行上下文创建 Provider 配置反序列化错误。
    pub(in crate::core::bot) fn json_deserialize(
        ctx: &ProviderExecutionContext,
        source: JsonError,
    ) -> Self {
        Self::JsonDeserialize {
            context: ctx.error_context(),
            source,
        }
    }

    /// Projects a settings-owned store error into a provider config-store error
    /// at the Provider settings boundary.
    ///
    /// 在 Provider settings 边界上将 settings 持有的存储错误投影为 Provider 配置存储错误。
    pub(in crate::core::bot) fn config_store(
        ctx: &ProviderExecutionContext,
        source: SettingsError,
    ) -> Self {
        Self::ConfigStore {
            context: ctx.error_context(),
            source,
        }
    }
}

// Downgrades a ProviderError into a warning log rather than propagating to the boundary.
//
// 将 ProviderError 降级为警告日志，不上抛到边界。
crate::impl_downgrade!(ProviderError);
