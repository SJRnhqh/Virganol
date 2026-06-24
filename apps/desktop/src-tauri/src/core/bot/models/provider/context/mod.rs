// apps/desktop/src-tauri/src/core/bot/models/provider/context/mod.rs
mod base;
mod error;
mod manager;
mod operation;
mod stage;

pub(self) use base::ProviderContext;
pub(in crate::core::bot) use error::ProviderErrorContext;
pub(in crate::core::bot) use manager::ProviderManagerContext;
pub(self) use operation::ProviderOperation;
pub(self) use stage::ProviderStage;
