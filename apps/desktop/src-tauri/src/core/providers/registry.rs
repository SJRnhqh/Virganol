// apps/desktop/src-tauri/src/core/providers/registry.rs
// 外部依赖
use std::collections::HashMap;
use std::sync::OnceLock;

// 内部引用
use crate::core::models::provider::id::ProviderId;
use crate::core::providers::connections::{deepseek, ollama};

use super::driver::{DriverFuture, ProviderDriver};

struct DeepseekDriver;
struct OllamaDriver;

impl ProviderDriver for DeepseekDriver {
    fn provider_id(&self) -> ProviderId {
        ProviderId::Deepseek
    }
    fn health_check<'a>(&'a self, _url: &'a str, key: &'a str) -> DriverFuture<'a> {
        Box::pin(async move { deepseek::deepseek_check(key).await })
    }
}

impl ProviderDriver for OllamaDriver {
    fn provider_id(&self) -> ProviderId {
        ProviderId::Ollama
    }
    fn health_check<'a>(&'a self, url: &'a str, key: &'a str) -> DriverFuture<'a> {
        Box::pin(async move { ollama::ollama_check(url, key).await })
    }
}

static DEEPSEEK_DRIVER: DeepseekDriver = DeepseekDriver;
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

pub fn get_driver(provider_id: ProviderId) -> Option<&'static dyn ProviderDriver> {
    registry().get(&provider_id).copied()
}
