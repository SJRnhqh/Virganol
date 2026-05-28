// apps/desktop/src-tauri/src/core/bot/models/provider/secret/mod.rs
mod change;
mod key;
mod resolution;

pub(crate) use change::ProviderKeyChange;
pub(crate) use key::ProviderKey;
pub(crate) use resolution::ProviderKeyResolution;
