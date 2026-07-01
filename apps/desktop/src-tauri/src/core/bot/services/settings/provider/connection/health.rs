// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/health.rs
use super::super::super::super::super::{HealthCheckResult, ProviderExecutionContext, ProviderId};
use super::get_driver;

/// Unified entry point for provider health checks.
///
/// 统一健康检查入口，按供应商标识路由到对应驱动。
pub(super) async fn health_check(
    ctx: &ProviderExecutionContext,
    provider_id: ProviderId,
    url: &str,
    key: &str,
) -> HealthCheckResult {
    let driver = get_driver(provider_id);
    driver.health_check(ctx, url, key).await
}
