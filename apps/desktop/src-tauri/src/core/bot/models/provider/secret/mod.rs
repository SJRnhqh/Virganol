// apps/desktop/src-tauri/src/core/bot/models/provider/secret/mod.rs
mod change;
mod key;
mod meta;
mod resolution;

pub(in crate::core::bot) use change::ProviderKeyChange;
pub(in crate::core::bot) use key::ProviderKey;
pub(in crate::core::bot) use meta::{ProviderKeyMeta, ProviderKeySource};
pub(in crate::core::bot) use resolution::ProviderResolvedKey;
