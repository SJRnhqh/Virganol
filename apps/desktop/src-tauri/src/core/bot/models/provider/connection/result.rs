// apps/desktop/src-tauri/src/core/bot/models/provider/connection/result.rs
use serde::Serialize;

use super::super::ProviderError;

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

    /// Domain error when the health check fails.
    ///
    /// 健康检查失败时的领域错误。
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<ProviderError>,
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
    pub(in crate::core::bot) fn fail(error: ProviderError) -> Self {
        Self {
            success: false,
            available_models: vec![],
            error: Some(error),
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

    /// Consumes the result and returns either discovered models or the domain error.
    ///
    /// 消费结果，返回发现的模型列表或领域错误。
    pub(in crate::core::bot) fn into_models(self) -> Result<Vec<String>, ProviderError> {
        match self.error {
            Some(error) => Err(error),
            None => Ok(self.available_models),
        }
    }
}
