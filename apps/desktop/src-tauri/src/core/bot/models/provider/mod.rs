// apps/desktop/src-tauri/src/core/bot/models/provider/mod.rs
mod common;
mod config;
mod connection;
mod context;
mod contract;
mod error;
mod lifecycle;
mod log;
mod secret;

pub(in crate::core) use common::ProviderState;
pub(in crate::core::bot) use common::{ProviderId, ProviderSubject};
pub(in crate::core::bot) use config::ProviderRecord;
pub(in crate::core::bot) use connection::HealthCheckResult;
pub(self) use context::{ProviderAttribution, ProviderOperation, ProviderScope, ProviderStage};
pub(in crate::core::bot) use context::{
    ProviderExecutionContext, ProviderLifecycleContext, ProviderManagerContext,
};
pub(crate) use contract::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ResetProviderRequest,
    ResetProviderResponse, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
pub(in crate::core::bot) use contract::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckStartedPayload,
    ProviderCheckStatusPayload,
};
pub(crate) use error::ProviderAppError;
pub(in crate::core::bot) use error::ProviderError;
pub(self) use error::ProviderFailureKind;
pub(crate) use lifecycle::ProviderCheckTrigger;
pub(in crate::core::bot) use lifecycle::{ProviderCheckFinalization, ProviderCheckRunResult};
pub(in crate::core::bot) use log::ProviderLogEntry;
pub(in crate::core::bot) use secret::{
    ProviderKey, ProviderKeyChange, ProviderKeyMeta, ProviderKeySource, ProviderResolvedKey,
};
