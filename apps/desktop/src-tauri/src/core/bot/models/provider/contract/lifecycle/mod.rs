// apps/desktop/src-tauri/src/core/bot/models/provider/contract/lifecycle/mod.rs
mod payload;

pub(in crate::core::bot) use payload::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckStartedPayload,
    ProviderCheckStatusPayload,
};
