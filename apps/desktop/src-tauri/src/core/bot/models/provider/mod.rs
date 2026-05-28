// apps/desktop/src-tauri/src/core/bot/models/provider/mod.rs
mod common;
mod config;
mod connection;
mod contract;
mod error;
mod id;
mod lifecycle;
mod secret;
mod security;

pub(crate) use common::ProviderState;
pub(crate) use config::{ProviderCheckSnapshot, ProviderRecord};
pub(crate) use connection::HealthCheckResult;
pub(crate) use contract::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ResetProviderRequest,
    ResetProviderResponse, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
pub(crate) use error::{ProviderError, ProviderErrorCode, ProviderIssue, SkippedProviderDetail};
pub(crate) use id::ProviderId;
pub(crate) use lifecycle::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckRunResult,
    ProviderCheckStartedPayload, ProviderCheckTrigger, ProviderStatusPayload,
};
pub(crate) use secret::{ProviderKey, ProviderKeyChange, ProviderKeyResolution};
pub(crate) use security::{ProviderKeySource, ProviderSecretMeta};
