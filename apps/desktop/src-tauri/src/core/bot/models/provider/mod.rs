// apps/desktop/src-tauri/src/core/bot/models/provider/mod.rs
mod common;
mod config;
mod connection;
mod contract;
mod error;
mod lifecycle;
mod secret;

pub(in crate::core::bot) use common::ProviderId;
pub(in crate::core) use common::ProviderState;
pub(in crate::core::bot) use config::ProviderCheckSnapshot;
pub(in crate::core::bot) use config::ProviderRecord;
pub(in crate::core::bot) use connection::HealthCheckResult;
pub(crate) use contract::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ResetProviderRequest,
    ResetProviderResponse, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
pub(crate) use error::{ProviderError, ProviderErrorKind, ProviderIssue, SkippedProviderDetail};
pub(crate) use lifecycle::ProviderCheckTrigger;
pub(in crate::core::bot) use lifecycle::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckFinalization,
    ProviderCheckRunResult, ProviderCheckStartedPayload, ProviderCheckStatusPayload,
};
pub(in crate::core::bot) use secret::{
    ProviderKey, ProviderKeyChange, ProviderKeyMeta, ProviderKeyResolution, ProviderKeySource,
};
