// apps/desktop/src-tauri/src/core/bot/models/provider/mod.rs
mod check;
mod common;
mod config;
mod connection;
mod contract;
mod error;
mod id;
mod secret;
mod security;
mod snapshot;

pub use check::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckStartedPayload,
    ProviderCheckTrigger, ProviderStatusPayload,
};
pub(crate) use common::ProviderState;
pub(crate) use config::ProviderRecord;
pub(crate) use connection::HealthCheckResult;
pub(crate) use contract::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ResetProviderRequest,
    ResetProviderResponse, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
pub use error::{ProviderError, ProviderErrorCode, ProviderIssue, SkippedProviderDetail};
pub use id::ProviderId;
pub(crate) use secret::{ProviderKey, ProviderKeyChange};
pub use security::{ProviderKeySource, ProviderSecretMeta};
pub use snapshot::SupportedProvidersSnapshot;
