// apps/desktop/src-tauri/src/core/bot/constants/provider/mod.rs
mod scope;

pub(in crate::core::bot) use scope::{
    PROVIDER_CONFIG_STORE_SCOPES, PROVIDER_CONNECTION_SCOPES, PROVIDER_LIFECYCLE_EMIT_SCOPES,
    PROVIDER_MANAGER_SCOPES, PROVIDER_SECRET_STORE_SCOPES,
};
