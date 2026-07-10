// apps/desktop/src-tauri/src/core/shared/models/state.rs
use super::super::super::ProviderState;

/// Shared application state managed by the desktop runtime.
///
/// 由桌面运行时管理的共享应用状态。
pub(crate) struct AppState {
    /// Provider subject subdomain runtime coordination state.
    ///
    /// 供应商主体子域运行时协调状态。
    provider: ProviderState,
}

impl AppState {
    /// Returns provider subject subdomain runtime coordination state.
    ///
    /// 返回供应商主体子域运行时协调状态。
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
