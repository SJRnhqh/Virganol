// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/registry.rs
use super::super::super::super::super::{
    DriverFuture, ProviderDriver, ProviderExecutionContext, ProviderId,
};
use super::{deepseek_check, ollama_check};

struct DeepSeekDriver;
struct OllamaDriver;

impl ProviderDriver for DeepSeekDriver {
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
    fn health_check<'a>(
        &'a self,
        ctx: &'a ProviderExecutionContext,
        url: &'a str,
        key: &'a str,
    ) -> DriverFuture<'a> {
        Box::pin(async move { ollama_check(ctx, url, key).await })
    }
}

static DEEPSEEK_DRIVER: DeepSeekDriver = DeepSeekDriver;
static OLLAMA_DRIVER: OllamaDriver = OllamaDriver;

pub(super) fn get_driver(provider_id: ProviderId) -> &'static dyn ProviderDriver {
    match provider_id {
        ProviderId::DeepSeek => &DEEPSEEK_DRIVER,
        ProviderId::Ollama => &OLLAMA_DRIVER,
    }
}
