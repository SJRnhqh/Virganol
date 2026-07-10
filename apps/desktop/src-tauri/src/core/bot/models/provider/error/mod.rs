// apps/desktop/src-tauri/src/core/bot/models/provider/error/mod.rs
mod app;
mod code;
mod details;
mod failure;
mod internal;

pub(crate) use app::ProviderAppError;
pub(self) use code::ProviderErrorCode;
pub(self) use details::ProviderErrorDetails;
pub(self) use failure::ProviderFailure;
pub(in crate::core::bot) use internal::ProviderError;
