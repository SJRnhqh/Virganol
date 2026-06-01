// apps/desktop/src-tauri/src/core/bot/models/provider/mod.rs
mod common;
mod config;
mod connection;
mod contract;
mod error;
mod lifecycle;
mod secret;

pub(crate) use common::{ProviderId, ProviderState};
pub(in crate::core::bot) use config::ProviderCheckSnapshot;
pub(crate) use config::ProviderRecord;
pub(crate) use connection::HealthCheckResult;
pub(crate) use contract::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ResetProviderRequest,
    ResetProviderResponse, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
pub(crate) use error::{ProviderError, ProviderErrorCode, ProviderIssue, SkippedProviderDetail};
pub(crate) use lifecycle::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckFinalization,
    ProviderCheckRunResult, ProviderCheckStartedPayload, ProviderCheckStatusPayload,
    ProviderCheckTrigger,
};
pub(crate) use secret::{
    ProviderKey, ProviderKeyChange, ProviderKeyMeta, ProviderKeyResolution, ProviderKeySource,
};
