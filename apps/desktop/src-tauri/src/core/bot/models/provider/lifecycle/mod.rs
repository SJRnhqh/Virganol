// apps/desktop/src-tauri/src/core/bot/models/provider/lifecycle/mod.rs
mod finalization;
mod payload;
mod run;
mod trigger;

pub(in crate::core::bot) use finalization::ProviderCheckFinalization;
pub(in crate::core::bot) use payload::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckStartedPayload,
    ProviderCheckStatusPayload,
};
pub(in crate::core::bot) use run::ProviderCheckRunResult;
pub(crate) use trigger::ProviderCheckTrigger;
