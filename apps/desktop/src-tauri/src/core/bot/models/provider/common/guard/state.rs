// apps/desktop/src-tauri/src/core/bot/models/provider/common/guard/state.rs
use parking_lot::{Mutex, MutexGuard};

/// Runtime coordination state for providers.
///
/// 供应商运行时协调状态。
pub(in crate::core) struct ProviderState {
    /// Global lock for provider configuration transactions.
    ///
    /// 保护供应商配置事务的全局锁。
    store_lock: Mutex<()>,
}

impl ProviderState {
    /// Locks provider configuration transactions.
    ///
    /// 锁定供应商配置事务，避免并发读改写覆盖。
    pub(in crate::core::bot) fn lock_store(&self) -> MutexGuard<'_, ()> {
        self.store_lock.lock()
    }
}

impl Default for ProviderState {
    /// Creates the default provider state.
    ///
    /// 创建默认供应商状态。
    fn default() -> Self {
        Self {
            store_lock: Mutex::new(()),
        }
    }
}
