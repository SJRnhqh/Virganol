// apps/desktop/src-tauri/src/core/shared/models/error/app.rs
use std::marker::PhantomData;

/// Generic application boundary error.
///
/// 应用边界错误。
pub(in crate::core) struct AppError<C, D = ()> {
    /// Machine-readable domain error code.
    ///
    /// 机器可读的领域错误码。
    code: C,
    /// Safe fallback message for display or logging.
    ///
    /// 用于展示或日志记录的安全兜底消息。
    message: String,
    /// Reserved marker for domain-specific structured error details.
    ///
    /// 预留给领域结构化错误细节的类型标记。
    _details: PhantomData<D>,
}

impl<C, D> AppError<C, D> {
    /// Creates an application boundary error.
    ///
    /// 创建应用边界错误。
    pub(in crate::core) fn new(code: C, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
            _details: PhantomData,
        }
    }

    /// Returns the machine-readable domain error code.
    ///
    /// 返回机器可读的领域错误码。
    pub(in crate::core) fn code(&self) -> &C {
        &self.code
    }

    /// Returns the safe fallback message.
    ///
    /// 返回安全兜底消息。
    pub(in crate::core) fn message(&self) -> &str {
        &self.message
    }
}
