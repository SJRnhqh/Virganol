// apps/desktop/src-tauri/src/core/bot/models/provider/connection/result.rs
use serde::Serialize;

/// Result of a provider health check.
///
/// Provider 健康检查结果。
#[derive(Serialize)]
pub(in crate::core::bot) struct HealthCheckResult {
    /// Whether the health check succeeded.
    ///
    /// 健康检查是否成功。
    success: bool,

    /// Models discovered during a successful health check.
    ///
    /// 健康检查成功时发现的模型列表。
    available_models: Vec<String>,

    /// Failure message for the current flat error contract.
    ///
    /// 当前扁平错误契约下的失败消息。
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

impl HealthCheckResult {
    /// Creates a successful health check result.
    ///
    /// 创建健康检查成功结果。
    pub(in crate::core::bot) fn ok(models: Vec<String>) -> Self {
        Self {
            success: true,
            available_models: models,
            error: None,
        }
    }

    /// Creates a failed health check result.
    ///
    /// 创建健康检查失败结果。
    pub(in crate::core::bot) fn fail(msg: impl Into<String>) -> Self {
        Self {
            success: false,
            available_models: vec![],
            error: Some(msg.into()),
        }
    }

    /// Returns whether the health check succeeded.
    ///
    /// 返回健康检查是否成功。
    pub(in crate::core::bot) fn is_success(&self) -> bool {
        self.success
    }

    /// Returns discovered models without consuming the result.
    ///
    /// 返回健康检查发现的模型列表，且不消费结果。
    pub(in crate::core::bot) fn available_models(&self) -> &[String] {
        &self.available_models
    }

    /// Returns the current flat failure message, if any.
    ///
    /// 返回当前扁平错误契约下的失败消息。
    pub(in crate::core::bot) fn error_message(&self) -> Option<&str> {
        self.error.as_deref()
    }

    /// Consumes the result and returns discovered models.
    ///
    /// 消费结果并返回健康检查发现的模型列表。
    pub(in crate::core::bot) fn into_available_models(self) -> Vec<String> {
        self.available_models
    }
}
