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
pub(in crate::core::bot) use config::{ProviderCheckSnapshot, ProviderRecord};
pub(in crate::core::bot) use connection::HealthCheckResult;
pub(crate) use contract::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ResetProviderRequest,
    ResetProviderResponse, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
pub(in crate::core::bot) use error::{ProviderAppError, ProviderError, ProviderErrorCode};
pub(crate) use error::{ProviderErrorKind, ProviderIssue};
pub(crate) use lifecycle::ProviderCheckTrigger;
pub(in crate::core::bot) use lifecycle::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckFinalization,
    ProviderCheckRunResult, ProviderCheckStartedPayload, ProviderCheckStatusPayload,
};
pub(in crate::core::bot) use secret::{
    ProviderKey, ProviderKeyChange, ProviderKeyMeta, ProviderKeyResolution, ProviderKeySource,
};
