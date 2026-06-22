// apps/desktop/src-tauri/src/core/shared/models/error/app.rs
use serde::Serialize;

/// Generic application boundary error.
///
/// 应用边界错误。
#[derive(Serialize)]
pub(in crate::core) struct AppError<C, D> {
    /// Machine-readable domain error code.
    ///
    /// 机器可读的领域错误码。
    code: C,
    /// Safe fallback message for display or logging.
    ///
    /// 用于展示或日志记录的安全兜底消息。
    message: String,
    /// Domain-specific structured error details.
    ///
    /// 领域结构化错误细节。
    details: D,
}

impl<C, D> AppError<C, D> {
    /// Creates an application boundary error with structured details.
    ///
    /// 创建带结构化细节的应用边界错误。
    pub(in crate::core) fn new(code: C, message: impl Into<String>, details: D) -> Self {
        Self {
            code,
            message: message.into(),
            details,
        }
    }
}
