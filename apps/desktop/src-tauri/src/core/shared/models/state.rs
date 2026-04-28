// apps/desktop/src-tauri/src/core/shared/models/state.rs
use super::super::super::ProviderState;

pub(crate) struct AppState {
    pub(crate) provider: ProviderState,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            provider: ProviderState::default(),
        }
    }
}
