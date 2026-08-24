// apps/desktop/src-tauri/src/core/bot/models/provider/connection/result.rs
use super::super::ProviderError;

/// Provider health check result.
///
/// 供应商健康检查结果。
pub(in crate::core::bot) enum HealthCheckResult {
    /// Successful result with discovered models.
    ///
    /// 成功结果及发现的模型列表。
    Success {
        /// Models discovered by the health check.
        ///
        /// 健康检查发现的模型列表。
        available_models: Vec<String>,
    },
    /// Failed result with the error.
    ///
    /// 失败结果及错误。
    Failure {
        /// Error raised during the health check.
        ///
        /// 健康检查期间产生的错误。
        error: ProviderError,
    },
}

impl HealthCheckResult {
    /// Creates a successful result.
    ///
    /// 创建成功结果。
    pub(in crate::core::bot) fn ok(models: Vec<String>) -> Self {
        Self::Success {
            available_models: models,
        }
    }

    /// Creates a failed result.
    ///
    /// 创建失败结果。
    pub(in crate::core::bot) fn fail(error: ProviderError) -> Self {
        Self::Failure { error }
    }

    /// Returns whether the health check succeeded.
    ///
    /// 返回健康检查是否成功。
    pub(in crate::core::bot) fn is_success(&self) -> bool {
        matches!(self, Self::Success { .. })
    }

    /// Returns discovered models, or an empty slice on failure.
    ///
    /// 返回发现的模型；失败时返回空切片。
    pub(in crate::core::bot) fn available_models(&self) -> &[String] {
        match self {
            Self::Success { available_models } => available_models,
            Self::Failure { .. } => &[],
        }
    }

    /// Consumes the result into discovered models or an error.
    ///
    /// 消费结果并返回发现的模型或错误。
    pub(in crate::core::bot) fn into_models(self) -> Result<Vec<String>, ProviderError> {
        match self {
            Self::Success { available_models } => Ok(available_models),
            Self::Failure { error } => Err(error),
        }
    }
}
