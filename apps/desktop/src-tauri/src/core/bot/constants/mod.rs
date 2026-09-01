// apps/desktop/src-tauri/src/core/bot/constants/mod.rs
mod provider;
mod settings;

pub(super) use provider::{
    DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS, OLLAMA_HEALTH_CHECK_TIMEOUT_SECS, PROVIDER_KEYRING_SERVICE,
    PROVIDER_REALITY,
};
pub(super) use settings::{SETTINGS_FILE, SPIRIT_PROVIDERS_KEY};
