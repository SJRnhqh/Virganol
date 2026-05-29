// apps/desktop/src-tauri/src/core/bot/services/settings/provider/mod.rs
mod connection;
mod lifecycle;
mod manager;
mod store;

pub(self) use connection::{health_check_with_resolved_key, probe_provider_connection};
pub(crate) use lifecycle::check_providers_lifecycle;
pub(crate) use manager::{connect_and_save, reset_provider_config, update_provider_enabled_models};
pub(self) use store::{
    load_provider_check_snapshot, load_provider_record, remove_provider, remove_provider_key,
    resolve_provider_key, save_provider, update_models, ProviderKeyTransaction,
};
