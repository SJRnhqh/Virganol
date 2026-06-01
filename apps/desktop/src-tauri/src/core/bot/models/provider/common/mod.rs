// apps/desktop/src-tauri/src/core/bot/models/provider/common/mod.rs
mod id;
mod state;

pub(crate) use id::ProviderId;
pub(in crate::core) use state::ProviderState;
