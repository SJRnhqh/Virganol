// apps/desktop/src-tauri/src/core/providers/driver.rs
// 外部依赖
use std::future::Future;
use std::pin::Pin;

// 内部引用
use crate::core::models::provider::ProviderId;
use crate::core::models::settings::HealthCheckResponse;

pub type DriverFuture<'a> = Pin<Box<dyn Future<Output = HealthCheckResponse> + Send + 'a>>;

pub trait ProviderDriver: Send + Sync {
    fn provider_id(&self) -> ProviderId;
    fn health_check<'a>(&'a self, url: &'a str, key: &'a str) -> DriverFuture<'a>;
}
