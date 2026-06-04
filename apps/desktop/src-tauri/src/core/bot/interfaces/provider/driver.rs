// apps/desktop/src-tauri/src/core/bot/interfaces/provider/driver.rs
use std::future::Future;
use std::pin::Pin;

use super::super::super::{HealthCheckResult, ProviderId};

/// Boxed async result returned by a provider driver health check.
///
/// Provider 驱动健康检查返回的装箱异步结果。
pub(in crate::core::bot) type DriverFuture<'a> =
    Pin<Box<dyn Future<Output = HealthCheckResult> + Send + 'a>>;

/// Common interface implemented by provider-specific health check drivers.
///
/// Provider 专属健康检查驱动需要实现的通用接口。
pub(in crate::core::bot) trait ProviderDriver: Send + Sync {
    /// Returns the provider handled by this driver.
    ///
    /// 返回当前驱动负责处理的 Provider。
    fn provider_id(&self) -> ProviderId;

    /// Runs the provider health check with the persisted endpoint and secret.
    ///
    /// 使用持久化端点和密钥执行 Provider 健康检查。
    fn health_check<'a>(&'a self, url: &'a str, key: &'a str) -> DriverFuture<'a>;
}
