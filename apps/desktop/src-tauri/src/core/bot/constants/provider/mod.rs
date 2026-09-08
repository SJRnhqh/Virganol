// apps/desktop/src-tauri/src/core/bot/constants/provider/mod.rs
mod connection;
mod keyring;
mod reality;
mod span;

pub(in crate::core::bot) use connection::{
    DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS, OLLAMA_HEALTH_CHECK_TIMEOUT_SECS,
};
pub(in crate::core::bot) use keyring::PROVIDER_KEYRING_SERVICE;
pub(in crate::core::bot) use reality::PROVIDER_REALITY;
pub(in crate::core::bot) use span::{
    PROVIDER_EXECUTION_SPAN, PROVIDER_LIFECYCLE_SPAN, PROVIDER_MANAGER_SPAN,
};
