// apps/desktop/src-tauri/src/core/bot/models/provider/context/mod.rs
mod base;
mod error;
mod execution;
mod lifecycle;
mod manager;
mod operation;
mod scope;
mod stage;

pub(self) use base::ProviderContext;
pub(super) use error::ProviderErrorContext;
pub(in crate::core::bot) use execution::ProviderExecutionContext;
pub(in crate::core::bot) use lifecycle::ProviderLifecycleContext;
pub(in crate::core::bot) use manager::ProviderManagerContext;
pub(self) use operation::{ProviderManagerOperation, ProviderOperation};
pub(super) use scope::ProviderScope;
pub(self) use stage::ProviderStage;
