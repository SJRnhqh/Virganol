// apps/desktop/src-tauri/src/core/bot/constants/provider/mod.rs
mod connection;
mod keyring;
mod reality;

pub(in crate::core::bot) use connection::{
    DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS, OLLAMA_HEALTH_CHECK_TIMEOUT_SECS,
};
pub(in crate::core::bot) use keyring::PROVIDER_KEYRING_SERVICE;
pub(in crate::core::bot) use reality::PROVIDER_REALITY;
