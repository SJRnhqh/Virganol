// apps/desktop/src-tauri/src/core/bot/models/provider/common/mod.rs
mod element;
mod guard;

pub(in crate::core::bot) use element::{ProviderId, ProviderSubject};
pub(in crate::core) use guard::ProviderState;
