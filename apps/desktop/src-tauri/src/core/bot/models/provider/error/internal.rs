// apps/desktop/src-tauri/src/core/bot/models/provider/error/internal.rs
use keyring::Error as KeyringError;
use reqwest::Error as ReqwestError;
use serde_json::Error as JsonError;
use std::{error::Error as StdError, fmt};
use tauri::Error as TauriError;
use tokio::task::JoinError;

use super::super::super::super::super::impl_downgrade;
use super::super::super::SettingsError;
use super::super::{
    ProviderErrorContext, ProviderExecutionContext, ProviderLifecycleContext,
    ProviderManagerContext,
};
use super::ProviderFailure;

/// Internal error for the Provider subject subdomain.
///
/// 供应商主体子域的内部错误。
#[derive(Debug)]
pub(in crate::core::bot) struct ProviderError {
    /// Provider error attribution snapshot.
    ///
    /// 供应商错误归因快照。
    context: ProviderErrorContext,
    /// Provider failure fact.
    ///
    /// 供应商失败事实。
    failure: ProviderFailure,
}

impl ProviderError {
    /// Creates a manager payload validation error.
    ///
    /// 创建管理命令载荷校验错误。
    pub(in crate::core::bot) fn manager_request_payload_absent(
        ctx: &ProviderManagerContext,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::ManagerRequestPayloadAbsent,
        )
    }

    /// Creates a check started event emission error.
    ///
    /// 创建检查开始事件推送错误。
    pub(in crate::core::bot) fn check_started_emit(
        ctx: &ProviderLifecycleContext,
        source: TauriError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::CheckStartedEmit { source },
        )
    }

    /// Creates a check status event emission error.
    ///
    /// 创建检查状态事件推送错误。
    pub(in crate::core::bot) fn check_status_emit(
        ctx: &ProviderExecutionContext,
        source: TauriError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::CheckStatusEmit { source },
        )
    }

    /// Creates a check completed event emission error.
    ///
    /// 创建检查完成事件推送错误。
    pub(in crate::core::bot) fn check_completed_emit(
        ctx: &ProviderLifecycleContext,
        source: TauriError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::CheckCompletedEmit { source },
        )
    }

    /// Creates a check failed event emission error.
    ///
    /// 创建检查失败事件推送错误。
    pub(in crate::core::bot) fn check_failed_emit(
        ctx: &ProviderLifecycleContext,
        source: TauriError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::CheckFailedEmit { source },
        )
    }

    /// Creates a health check task join error.
    ///
    /// 创建健康检查任务汇合错误。
    pub(in crate::core::bot) fn check_task_join(
        ctx: &ProviderLifecycleContext,
        source: JoinError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::CheckTaskJoin { source },
        )
    }

    /// Creates a check aggregate error.
    ///
    /// 创建检查聚合错误。
    pub(in crate::core::bot) fn check_aggregate(ctx: &ProviderLifecycleContext) -> Self {
        Self::new(ctx.error_context(), ProviderFailure::CheckAggregate)
    }

    /// Creates an error for missing health check configuration.
    ///
    /// 创建健康检查配置缺失错误。
    pub(in crate::core::bot) fn health_check_missing_config(
        ctx: &ProviderExecutionContext,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::HealthCheckMissingConfig,
        )
    }

    /// Creates a health check network error.
    ///
    /// 创建健康检查网络错误。
    pub(in crate::core::bot) fn health_check_network(
        ctx: &ProviderExecutionContext,
        source: ReqwestError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::HealthCheckNetwork { source },
        )
    }

    /// Creates a health check HTTP status error.
    ///
    /// 创建健康检查响应状态码错误。
    pub(in crate::core::bot) fn health_check_http(ctx: &ProviderExecutionContext) -> Self {
        Self::new(ctx.error_context(), ProviderFailure::HealthCheckHttp)
    }

    /// Creates a health check response format error.
    ///
    /// 创建健康检查响应格式错误。
    pub(in crate::core::bot) fn health_check_response_format(
        ctx: &ProviderExecutionContext,
        source: ReqwestError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::HealthCheckResponseFormat { source },
        )
    }

    /// Creates an unsupported Provider error.
    ///
    /// 创建不受支持的供应商错误。
    pub(in crate::core::bot) fn unsupported_provider(ctx: &ProviderExecutionContext) -> Self {
        Self::new(ctx.error_context(), ProviderFailure::UnsupportedProvider)
    }

    /// Creates a configuration not found error.
    ///
    /// 创建配置缺失错误。
    pub(in crate::core::bot) fn config_not_found(ctx: &ProviderExecutionContext) -> Self {
        Self::new(ctx.error_context(), ProviderFailure::ConfigNotFound)
    }

    /// Creates a Provider configuration serialization error.
    ///
    /// 创建供应商配置序列化错误。
    pub(in crate::core::bot) fn json_serialize(
        ctx: &ProviderExecutionContext,
        source: JsonError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::JsonSerialize { source },
        )
    }

    /// Creates a Provider configuration deserialization error.
    ///
    /// 创建供应商配置反序列化错误。
    pub(in crate::core::bot) fn json_deserialize(
        ctx: &ProviderExecutionContext,
        source: JsonError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::JsonDeserialize { source },
        )
    }

    /// Creates a Provider configuration storage error from a settings error.
    ///
    /// 根据设置错误创建供应商配置存储错误。
    pub(in crate::core::bot) fn config_store(
        ctx: &ProviderExecutionContext,
        source: SettingsError,
    ) -> Self {
        Self::new(ctx.error_context(), ProviderFailure::ConfigStore { source })
    }

    /// Creates a secret store initialization error.
    ///
    /// 创建密钥存储初始化错误。
    pub(in crate::core::bot) fn secret_store_init(
        ctx: &ProviderExecutionContext,
        source: KeyringError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::SecretStoreInit { source },
        )
    }

    /// Creates a secret store write error.
    ///
    /// 创建密钥存储写入错误。
    pub(in crate::core::bot) fn secret_store_write(
        ctx: &ProviderExecutionContext,
        source: KeyringError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::SecretStoreWrite { source },
        )
    }

    /// Creates a secret store read error.
    ///
    /// 创建密钥存储读取错误。
    pub(in crate::core::bot) fn secret_store_read(
        ctx: &ProviderExecutionContext,
        source: KeyringError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::SecretStoreRead { source },
        )
    }

    /// Creates a secret store removal error.
    ///
    /// 创建密钥存储删除错误。
    pub(in crate::core::bot) fn secret_store_remove(
        ctx: &ProviderExecutionContext,
        source: KeyringError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            ProviderFailure::SecretStoreRemove { source },
        )
    }

    /// Returns the error attribution snapshot.
    ///
    /// 返回错误归因快照。
    pub(super) fn context(&self) -> &ProviderErrorContext {
        &self.context
    }

    /// Returns the Provider failure fact.
    ///
    /// 返回供应商失败事实。
    pub(super) fn failure(&self) -> &ProviderFailure {
        &self.failure
    }

    /// Creates an internal Provider error.
    ///
    /// 创建供应商内部错误。
    fn new(context: ProviderErrorContext, failure: ProviderFailure) -> Self {
        Self { context, failure }
    }
}

impl fmt::Display for ProviderError {
    /// Formats the attributed Provider error.
    ///
    /// 格式化已归因的供应商错误。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} for {}", self.failure, self.context)?;

        if let Some(source) = self.failure.source() {
            write!(f, ": {source}")?;
        }

        Ok(())
    }
}

impl StdError for ProviderError {
    /// Returns the underlying error source.
    ///
    /// 返回底层错误源。
    fn source(&self) -> Option<&(dyn StdError + 'static)> {
        self.failure.source()
    }
}

// Enables warning level downgrades for internal Provider errors.
//
// 为供应商内部错误启用警告级降级。
impl_downgrade!(ProviderError);
