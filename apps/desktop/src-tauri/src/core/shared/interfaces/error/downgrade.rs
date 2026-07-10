// apps/desktop/src-tauri/src/core/shared/interfaces/error/downgrade.rs

/// Error downgrade trait that handles an error as a warning instead of propagating it to the application boundary.
///
/// 错误降级特型，将错误按警告处理，而不是传播到应用边界。
pub(in crate::core) trait Downgrade {
    /// Handles this error by logging it as a warning.
    ///
    /// 将当前错误按警告级别记录。
    fn downgrade(self);
}

/// Implements the [`Downgrade`] trait for references to an error type.
///
/// 为错误类型的引用实现错误降级特型。
macro_rules! impl_downgrade {
    ($type:ty) => {
        impl $crate::core::shared::Downgrade for &$type {
            /// Logs the borrowed error as a warning.
            ///
            /// 将借用的错误按警告级别记录。
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
