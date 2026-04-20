// apps/desktop/src-tauri/src/core/bot/interfaces/provider/driver.rs
// 外部依赖
use std::future::Future;
use std::pin::Pin;

// 内部引用
use super::super::super::{HealthCheckResponse, ProviderId};

pub(crate) type DriverFuture<'a> = Pin<Box<dyn Future<Output = HealthCheckResponse> + Send + 'a>>;

pub(crate) trait ProviderDriver: Send + Sync {
    fn provider_id(&self) -> ProviderId;
    fn health_check<'a>(&'a self, url: &'a str, key: &'a str) -> DriverFuture<'a>;
}
