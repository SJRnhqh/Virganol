// apps/desktop/src-tauri/src/core/bot/models/provider/connection/result.rs
use super::super::ProviderError;

/// Result of a provider health check.
///
/// Provider 健康检查结果。
pub(in crate::core::bot) enum HealthCheckResult {
    /// Successful health check with discovered models.
    ///
    /// 健康检查成功，并携带发现的模型列表。
    Success {
        /// Models discovered during a successful health check.
        ///
        /// 健康检查成功时发现的模型列表。
        available_models: Vec<String>,
    },
    /// Failed health check with the domain error.
    ///
    /// 健康检查失败，并携带领域错误。
    Failure {
        /// Domain error raised during the health check.
        ///
        /// 健康检查期间产生的领域错误。
        error: ProviderError,
    },
}

impl HealthCheckResult {
    /// Creates a successful health check result.
    ///
    /// 创建健康检查成功结果。
    pub(in crate::core::bot) fn ok(models: Vec<String>) -> Self {
        Self::Success {
            available_models: models,
        }
    }

    /// Creates a failed health check result.
    ///
    /// 创建健康检查失败结果。
    pub(in crate::core::bot) fn fail(error: ProviderError) -> Self {
        Self::Failure { error }
    }

    /// Returns whether the health check succeeded.
    ///
    /// 返回健康检查是否成功。
    pub(in crate::core::bot) fn is_success(&self) -> bool {
        matches!(self, Self::Success { .. })
    }

    /// Returns discovered models without consuming the result.
    ///
    /// 返回健康检查发现的模型列表，且不消费结果。
    pub(in crate::core::bot) fn available_models(&self) -> &[String] {
        match self {
            Self::Success { available_models } => available_models,
            Self::Failure { .. } => &[],
        }
    }

    /// Consumes the result and returns either discovered models or the domain error.
    ///
    /// 消费结果，返回发现的模型列表或领域错误。
    pub(in crate::core::bot) fn into_models(self) -> Result<Vec<String>, ProviderError> {
        match self {
            Self::Success { available_models } => Ok(available_models),
            Self::Failure { error } => Err(error),
        }
    }
}
