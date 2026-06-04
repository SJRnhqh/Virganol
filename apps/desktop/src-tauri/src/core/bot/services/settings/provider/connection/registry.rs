// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/registry.rs
use std::collections::HashMap;
use std::sync::OnceLock;

use super::super::super::super::super::{DriverFuture, ProviderDriver, ProviderId};
use super::{deepseek_check, ollama_check};

struct DeepSeekDriver;
struct OllamaDriver;

impl ProviderDriver for DeepSeekDriver {
    fn provider_id(&self) -> ProviderId {
        ProviderId::DeepSeek
    }
    fn health_check<'a>(&'a self, _url: &'a str, key: &'a str) -> DriverFuture<'a> {
        Box::pin(async move { deepseek_check(key).await })
    }
}

impl ProviderDriver for OllamaDriver {
    fn provider_id(&self) -> ProviderId {
        ProviderId::Ollama
    }
    fn health_check<'a>(&'a self, url: &'a str, key: &'a str) -> DriverFuture<'a> {
        Box::pin(async move { ollama_check(url, key).await })
    }
}

static DEEPSEEK_DRIVER: DeepSeekDriver = DeepSeekDriver;
static OLLAMA_DRIVER: OllamaDriver = OllamaDriver;
static REGISTRY: OnceLock<HashMap<ProviderId, &'static dyn ProviderDriver>> = OnceLock::new();

fn register_driver(
    map: &mut HashMap<ProviderId, &'static dyn ProviderDriver>,
    driver: &'static dyn ProviderDriver,
) {
    map.insert(driver.provider_id(), driver);
}

fn registry() -> &'static HashMap<ProviderId, &'static dyn ProviderDriver> {
    REGISTRY.get_or_init(|| {
        let mut map = HashMap::new();
        register_driver(&mut map, &DEEPSEEK_DRIVER as &dyn ProviderDriver);
        register_driver(&mut map, &OLLAMA_DRIVER as &dyn ProviderDriver);
        map
    })
}

pub(super) fn get_driver(provider_id: ProviderId) -> Option<&'static dyn ProviderDriver> {
    registry().get(&provider_id).copied()
}
