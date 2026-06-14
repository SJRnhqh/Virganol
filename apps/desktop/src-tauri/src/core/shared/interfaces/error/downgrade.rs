// apps/desktop/src-tauri/src/core/shared/interfaces/error/downgrade.rs

/// Downgrade a domain error to a warning log rather than propagating to the boundary layer.
///
/// 将领域错误降级为警告日志，不向上传播到边界层。
pub(in crate::core) trait Downgrade {
    /// Consume the error and log it as a warning.
    ///
    /// 消费错误并记录为警告日志。
    fn downgrade(self);
}

/// Implements [`Downgrade`] for a domain error type.
///
/// 为领域错误类型实现 [`Downgrade`]。
#[macro_export]
macro_rules! impl_downgrade {
    ($type:ty) => {
        impl $crate::core::shared::Downgrade for $type {
            fn downgrade(self) {
                log::warn!("[Tauri] ⚠️ {}", self);
            }
        }
    };
}
