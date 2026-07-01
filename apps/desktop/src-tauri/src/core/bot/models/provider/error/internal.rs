// apps/desktop/src-tauri/src/core/bot/models/provider/error/internal.rs
use keyring::Error as KeyringError;
use reqwest::Error as ReqwestError;
use serde_json::Error as JsonError;
use tauri::Error as TauriError;
use thiserror::Error;
use tokio::task::JoinError;

use super::super::super::SettingsError;
use super::super::{
    ProviderErrorContext, ProviderExecutionContext, ProviderLifecycleContext,
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
    /// 供应商检查生命周期状态事件推送失败。
    #[error("failed to emit provider check status event for {context}: {source}")]
    CheckStatusEmit {
        /// Provider status event error attribution context.
        ///
        /// 供应商状态事件错误归因上下文。
        context: ProviderErrorContext,
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
    /// 供应商检查任务汇合失败。
    #[error("provider check task join failed for {context}: {source}")]
    CheckTaskJoin {
        /// Provider lifecycle execution error attribution context.
        ///
        /// 供应商生命周期执行错误归因上下文。
        context: ProviderErrorContext,
        /// Tokio task join error raised by the concurrent health-check task.
        ///
        /// 并发健康检查任务产生的 Tokio task join 错误。
        #[source]
        source: JoinError,
    },
    /// Provider check collected provider-level errors during lifecycle execution.
    ///
    /// 供应商检查生命周期执行期间收集到了供应商级错误。
    #[error("provider check collected provider-level errors for {context}")]
    CheckAggregate {
        /// Provider lifecycle aggregate error attribution context.
        ///
        /// 供应商生命周期聚合错误归因上下文。
        context: ProviderErrorContext,
    },
    /// Required health check configuration is missing.
    ///
    /// 健康检查所需配置缺失。
    #[error("provider health check configuration is missing for {context}")]
    HealthCheckMissingConfig {
        /// Provider connection error attribution context.
        ///
        /// Provider 连接错误归因上下文。
        context: ProviderErrorContext,
    },
    /// Health check network connection failed.
    ///
    /// 健康检查网络连接失败。
    #[error("provider health check network request failed for {context}: {source}")]
    HealthCheckNetwork {
        /// Provider connection error attribution context.
        ///
        /// Provider 连接错误归因上下文。
        context: ProviderErrorContext,
        /// HTTP client request error.
        ///
        /// HTTP 客户端请求错误。
        #[source]
        source: ReqwestError,
    },
    /// Health check HTTP status indicates failure.
    ///
    /// 健康检查 HTTP 状态码表示失败。
    #[error("provider health check HTTP status indicates failure for {context}")]
    HealthCheckHttp {
        /// Provider connection error attribution context.
        ///
        /// Provider 连接错误归因上下文。
        context: ProviderErrorContext,
    },
    /// Health check response format is invalid.
    ///
    /// 健康检查响应格式无效。
    #[error("provider health check response format is invalid for {context}: {source}")]
    HealthCheckResponseFormat {
        /// Provider connection error attribution context.
        ///
        /// Provider 连接错误归因上下文。
        context: ProviderErrorContext,
        /// HTTP response decoding error.
        ///
        /// HTTP 响应解码错误。
        #[source]
        source: ReqwestError,
    },
    /// Provider id from storage is not supported by the current backend.
    ///
    /// 存储中的供应商标识不被当前后端支持。
    #[error("provider is not supported by the current backend for {context}")]
    UnsupportedProvider {
        /// Provider error attribution context.
        ///
        /// Provider 错误归因上下文。
        context: ProviderErrorContext,
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
    #[error("provider secret store could not be initialized for {context}: {source}")]
    SecretStoreInit {
        /// Provider secret-store error attribution context.
        ///
        /// Provider 密钥存储错误归因上下文。
        context: ProviderErrorContext,
        /// Keyring initialization error.
        ///
        /// keyring 初始化错误。
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be written.
    ///
    /// 系统密钥存储无法写入。
    #[error("provider secret store could not be written for {context}: {source}")]
    SecretStoreWrite {
        /// Provider secret-store error attribution context.
        ///
        /// Provider 密钥存储错误归因上下文。
        context: ProviderErrorContext,
        /// Keyring write error.
        ///
        /// keyring 写入错误。
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be read.
    ///
    /// 系统密钥存储无法读取。
    #[error("provider secret store could not be read for {context}: {source}")]
    SecretStoreRead {
        /// Provider secret-store error attribution context.
        ///
        /// Provider 密钥存储错误归因上下文。
        context: ProviderErrorContext,
        /// Keyring read error.
        ///
        /// keyring 读取错误。
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be removed (delete).
    ///
    /// 系统密钥存储无法删除。
    #[error("provider secret store could not be removed for {context}: {source}")]
    SecretStoreRemove {
        /// Provider secret-store error attribution context.
        ///
        /// Provider 密钥存储错误归因上下文。
        context: ProviderErrorContext,
        /// Keyring remove error.
        ///
        /// keyring 删除错误。
        #[source]
        source: KeyringError,
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

    /// Creates a lifecycle status event emission error from the execution context.
    ///
    /// 基于执行上下文创建生命周期状态事件推送错误。
    pub(in crate::core::bot) fn check_status_emit(
        ctx: &ProviderExecutionContext,
        source: TauriError,
    ) -> Self {
        Self::CheckStatusEmit {
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

    /// Creates a lifecycle health-check task join error from the lifecycle context.
    ///
    /// 基于生命周期上下文创建健康检查任务汇合错误。
    pub(in crate::core::bot) fn check_task_join(
        ctx: &ProviderLifecycleContext,
        source: JoinError,
    ) -> Self {
        Self::CheckTaskJoin {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a lifecycle aggregate error from the lifecycle context.
    ///
    /// 基于生命周期上下文创建生命周期聚合错误。
    pub(in crate::core::bot) fn check_aggregate(ctx: &ProviderLifecycleContext) -> Self {
        Self::CheckAggregate {
            context: ctx.error_context(),
        }
    }

    /// Creates a health-check missing configuration error from the execution context.
    ///
    /// 基于执行上下文创建健康检查配置缺失错误。
    pub(in crate::core::bot) fn health_check_missing_config(
        ctx: &ProviderExecutionContext,
    ) -> Self {
        Self::HealthCheckMissingConfig {
            context: ctx.error_context(),
        }
    }

    /// Creates a health-check network error from the execution context.
    ///
    /// 基于执行上下文创建健康检查网络错误。
    pub(in crate::core::bot) fn health_check_network(
        ctx: &ProviderExecutionContext,
        source: ReqwestError,
    ) -> Self {
        Self::HealthCheckNetwork {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a health-check HTTP status error from the execution context.
    ///
    /// 基于执行上下文创建健康检查状态码错误。
    pub(in crate::core::bot) fn health_check_http(ctx: &ProviderExecutionContext) -> Self {
        Self::HealthCheckHttp {
            context: ctx.error_context(),
        }
    }

    /// Creates a health-check response format error from the execution context.
    ///
    /// 基于执行上下文创建健康检查响应格式错误。
    pub(in crate::core::bot) fn health_check_response_format(
        ctx: &ProviderExecutionContext,
        source: ReqwestError,
    ) -> Self {
        Self::HealthCheckResponseFormat {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates an unsupported-provider error from the execution context.
    ///
    /// 基于执行上下文创建不支持的 provider 错误。
    pub(in crate::core::bot) fn unsupported_provider(ctx: &ProviderExecutionContext) -> Self {
        Self::UnsupportedProvider {
            context: ctx.error_context(),
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

    /// Creates a secret-store initialization error from the execution context.
    ///
    /// 基于执行上下文创建密钥存储初始化错误。
    pub(in crate::core::bot) fn secret_store_init(
        ctx: &ProviderExecutionContext,
        source: KeyringError,
    ) -> Self {
        Self::SecretStoreInit {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a secret-store write error from the execution context.
    ///
    /// 基于执行上下文创建密钥存储写入错误。
    pub(in crate::core::bot) fn secret_store_write(
        ctx: &ProviderExecutionContext,
        source: KeyringError,
    ) -> Self {
        Self::SecretStoreWrite {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a secret-store read error from the execution context.
    ///
    /// 基于执行上下文创建密钥存储读取错误。
    pub(in crate::core::bot) fn secret_store_read(
        ctx: &ProviderExecutionContext,
        source: KeyringError,
    ) -> Self {
        Self::SecretStoreRead {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a secret-store remove error from the execution context.
    ///
    /// 基于执行上下文创建密钥存储删除错误。
    pub(in crate::core::bot) fn secret_store_remove(
        ctx: &ProviderExecutionContext,
        source: KeyringError,
    ) -> Self {
        Self::SecretStoreRemove {
            context: ctx.error_context(),
            source,
        }
    }
}

// Downgrades a ProviderError into a warning log rather than propagating to the boundary.
//
// 将 ProviderError 降级为警告日志，不上抛到边界。
crate::impl_downgrade!(ProviderError);
