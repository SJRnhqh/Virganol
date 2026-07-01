// apps/desktop/src-tauri/src/core/bot/interfaces/provider/driver.rs
use std::future::Future;
use std::pin::Pin;

use super::super::super::{HealthCheckResult, ProviderExecutionContext};

/// Boxed async result returned by a provider driver health check.
///
/// 供应商驱动健康检查返回的装箱异步结果。
pub(in crate::core::bot) type DriverFuture<'a> =
    Pin<Box<dyn Future<Output = HealthCheckResult> + Send + 'a>>;

/// Common interface implemented by provider-specific health check drivers.
///
/// 供应商专属健康检查驱动需要实现的通用接口。
pub(in crate::core::bot) trait ProviderDriver: Send + Sync {
    /// Runs the provider health check with execution context, endpoint, and secret.
    ///
    /// 使用执行上下文、端点和密钥执行供应商健康检查。
    fn health_check<'a>(
        &'a self,
        ctx: &'a ProviderExecutionContext,
        url: &'a str,
        key: &'a str,
    ) -> DriverFuture<'a>;
}
