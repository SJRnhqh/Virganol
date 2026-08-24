// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/registry.rs
use super::super::super::super::super::{
    DriverFuture, ProviderDriver, ProviderExecutionContext,
    ProviderId::{self, DeepSeek, Ollama},
};
use super::{deepseek_check, ollama_check};

/// DeepSeek provider driver.
///
/// DeepSeek 供应商驱动。
struct DeepSeekDriver;

/// Ollama provider driver.
///
/// Ollama 供应商驱动。
struct OllamaDriver;

impl ProviderDriver for DeepSeekDriver {
    /// Runs a DeepSeek health check.
    ///
    /// 执行 DeepSeek 健康检查。
    fn health_check<'a>(
        &'a self,
        ctx: &'a ProviderExecutionContext,
        _url: &'a str,
        key: &'a str,
    ) -> DriverFuture<'a> {
        Box::pin(async move { deepseek_check(ctx, key).await })
    }
}

impl ProviderDriver for OllamaDriver {
    /// Runs an Ollama health check.
    ///
    /// 执行 Ollama 健康检查。
    fn health_check<'a>(
        &'a self,
        ctx: &'a ProviderExecutionContext,
        url: &'a str,
        key: &'a str,
    ) -> DriverFuture<'a> {
        Box::pin(async move { ollama_check(ctx, url, key).await })
    }
}

/// Shared stateless DeepSeek driver.
///
/// 共享的无状态 DeepSeek 驱动。
static DEEPSEEK_DRIVER: DeepSeekDriver = DeepSeekDriver;

/// Shared stateless Ollama driver.
///
/// 共享的无状态 Ollama 驱动。
static OLLAMA_DRIVER: OllamaDriver = OllamaDriver;

/// Returns the driver registered for a provider.
///
/// 返回指定供应商已注册的驱动。
pub(super) fn get_driver(provider_id: ProviderId) -> &'static dyn ProviderDriver {
    match provider_id {
        DeepSeek => &DEEPSEEK_DRIVER,
        Ollama => &OLLAMA_DRIVER,
    }
}
