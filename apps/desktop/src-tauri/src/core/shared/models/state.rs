// apps/desktop/src-tauri/src/core/shared/models/state.rs
use super::super::super::ProviderState;

/// Shared Tauri application state managed by the desktop runtime.
///
/// 由桌面运行时管理的 Tauri 共享应用状态。
pub(crate) struct AppState {
    /// Provider-domain runtime coordination state.
    ///
    /// Provider 领域运行时协调状态。
    provider: ProviderState,
}

impl AppState {
    /// Returns provider-domain runtime coordination state.
    ///
    /// 返回 Provider 领域运行时协调状态。
    pub(in crate::core) fn provider(&self) -> &ProviderState {
        &self.provider
    }
}

impl Default for AppState {
    /// Creates the default shared application state.
    ///
    /// 创建默认共享应用状态。
    fn default() -> Self {
        Self {
            provider: ProviderState::default(),
        }
    }
}
