// apps/desktop/src-tauri/src/core/shared/interfaces/error/downgrade.rs

/// Error downgrade trait that logs an error as a warning instead of propagating it to the application boundary.
///
/// 错误降级特型，将错误记录为警告日志，而不是传播到应用边界。
pub(in crate::core) trait Downgrade {
    /// Consumes the error and logs it as a warning.
    ///
    /// 消费错误并以警告级别记录。
    fn downgrade(self);
}

/// Implements the [`Downgrade`] trait for an error type.
///
/// 为错误类型实现错误降级特型。
macro_rules! impl_downgrade {
    ($type:ty) => {
        impl $crate::core::shared::Downgrade for &$type {
            /// Consumes the error and logs it as a warning.
            ///
            /// 消费错误并以警告级别记录。
            fn downgrade(self) {
                log::warn!("[Tauri] ⚠️ {}", self);
            }
        }
    };
}

// Keep the macro visible only within core.
//
// 将宏限制在核心层内可见。
pub(in crate::core) use impl_downgrade;
