// apps/desktop/src-tauri/src/core/bot/models/provider/log/mod.rs
mod entry;
mod observation;
mod occurrence;

pub(in crate::core::bot) use entry::ProviderLogEntry;
pub(self) use observation::ProviderObservation;
pub(self) use occurrence::ProviderOccurrence;
