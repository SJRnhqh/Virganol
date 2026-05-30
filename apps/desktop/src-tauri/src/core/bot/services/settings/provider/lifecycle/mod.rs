// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/mod.rs
mod events;
mod failure;
mod flow;
mod processor;
mod rid;
mod runner;

pub(self) use events::{
    emit_check_completed, emit_check_failed, emit_check_started, emit_provider_status,
};
pub(self) use failure::report_lifecycle_failure;
pub(crate) use flow::check_providers_lifecycle;
pub(self) use processor::finalize_provider_check_result;
pub(self) use rid::next_run_id;
pub(self) use runner::run_provider_checks;
