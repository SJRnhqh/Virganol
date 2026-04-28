// apps/desktop/src-tauri/src/core/bot/models/provider/common/state.rs
use parking_lot::Mutex;

/// Provider 功能的状态管理
///
/// State management for provider-related functionality
pub(crate) struct ProviderState {
    /// 全局 store 锁，保护 providers 配置的读写事务
    ///
    /// Global store lock for protecting provider config read-write transactions
    pub(crate) store_lock: Mutex<()>,
}

impl Default for ProviderState {
    fn default() -> Self {
        Self {
            store_lock: Mutex::new(()),
        }
    }
}
