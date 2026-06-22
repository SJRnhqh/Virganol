// apps/desktop/src-tauri/src/core/bot/models/provider/contract/lifecycle/status.rs
use serde::Serialize;

use super::super::super::{HealthCheckResult, ProviderAppError, ProviderKeyMeta, ProviderRecord};

/// Provider runtime status projected for lifecycle status events.
///
/// 生命周期 status 事件中面向边界契约的 Provider 运行时状态投影。
#[derive(Serialize)]
pub(super) struct ProviderRuntimeStatus {
    /// Persisted provider config snapshot used for this status update.
    ///
    /// 当前 Provider 的已持久化配置快照。
    config: ProviderRecord,
    /// Sanitized provider key metadata resolved for this check.
    ///
    /// 当前 Provider 的去敏密钥元信息。
    key_meta: ProviderKeyMeta,
    /// Boundary-safe provider connection status.
    ///
    /// 面向边界契约的 Provider 连接状态。
    connection: ProviderConnectionStatus,
}

impl ProviderRuntimeStatus {
    /// Creates a boundary runtime status from internal lifecycle parts.
    ///
    /// 从生命周期内部数据创建边界运行时状态。
    pub(super) fn from_parts(
        config: ProviderRecord,
        key_meta: ProviderKeyMeta,
        health: HealthCheckResult,
    ) -> Self {
        let connection = match health.into_models() {
            Ok(available_models) => ProviderConnectionStatus::Connected { available_models },
            Err(error) => ProviderConnectionStatus::Failed {
                error: ProviderAppError::from(&error),
            },
        };

        Self {
            config,
            key_meta,
            connection,
        }
    }
}

/// Boundary-safe provider connection status for lifecycle status events.
///
/// 生命周期 status 事件中面向边界契约的 Provider 连接状态。
#[derive(Serialize)]
#[serde(tag = "state", rename_all = "snake_case")]
enum ProviderConnectionStatus {
    /// Provider health check succeeded and returned available models.
    ///
    /// Provider 健康检查成功，并返回可用模型。
    Connected {
        /// Models discovered during the health check.
        ///
        /// 健康检查发现的模型列表。
        available_models: Vec<String>,
    },
    /// Provider health check failed with a boundary error.
    ///
    /// Provider 健康检查失败，并携带边界错误。
    Failed {
        /// Boundary error derived from the internal provider error.
        ///
        /// 由内部 Provider 错误转换得到的边界错误。
        error: ProviderAppError,
    },
}
