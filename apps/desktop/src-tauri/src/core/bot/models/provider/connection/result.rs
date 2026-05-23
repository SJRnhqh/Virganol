// apps/desktop/src-tauri/src/core/bot/models/provider/connection/result.rs
use serde::Serialize;

/// Result of a provider health check.
///
/// Provider 健康检查结果。
#[derive(Serialize)]
pub(crate) struct HealthCheckResult {
    /// Whether the health check succeeded.
    ///
    /// 健康检查是否成功。
    pub(crate) success: bool,

    /// Models discovered during a successful health check.
    ///
    /// 健康检查成功时发现的模型列表。
    pub(crate) available_models: Vec<String>,

    /// Failure message for the current flat error contract.
    ///
    /// 当前扁平错误契约下的失败消息。
    #[serde(skip_serializing_if = "Option::is_none")]
    pub(crate) error: Option<String>,
}

impl HealthCheckResult {
    /// Creates a successful health check result.
    ///
    /// 创建健康检查成功结果。
    pub(crate) fn ok(models: Vec<String>) -> Self {
        Self {
            success: true,
            available_models: models,
            error: None,
        }
    }

    /// Creates a failed health check result.
    ///
    /// 创建健康检查失败结果。
    pub(crate) fn fail(msg: impl Into<String>) -> Self {
        Self {
            success: false,
            available_models: vec![],
            error: Some(msg.into()),
        }
    }
}
