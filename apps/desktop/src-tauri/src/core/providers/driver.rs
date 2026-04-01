// apps/desktop/src-tauri/src/core/providers/driver.rs
// 外部依赖
use std::future::Future;
use std::pin::Pin;

// 内部引用
use crate::core::bot::models::HealthCheckResponse;
use crate::core::models::provider::ProviderId;

pub(crate) type DriverFuture<'a> = Pin<Box<dyn Future<Output = HealthCheckResponse> + Send + 'a>>;

pub(crate) trait ProviderDriver: Send + Sync {
    fn provider_id(&self) -> ProviderId;
    fn health_check<'a>(&'a self, url: &'a str, key: &'a str) -> DriverFuture<'a>;
}
