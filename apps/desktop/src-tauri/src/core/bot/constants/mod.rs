// apps/desktop/src-tauri/src/core/bot/constants/mod.rs
mod connection;
mod keyring;
mod settings;

pub(super) use connection::{DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS, OLLAMA_HEALTH_CHECK_TIMEOUT_SECS};
pub(super) use keyring::PROVIDER_KEYRING_SERVICE;
pub(super) use settings::{SETTINGS_FILE, SPIRIT_PROVIDERS_KEY};
