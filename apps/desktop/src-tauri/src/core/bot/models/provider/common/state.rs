// apps/desktop/src-tauri/src/core/bot/models/provider/common/state.rs
use parking_lot::{Mutex, MutexGuard};

/// Provider-domain runtime coordination state.
///
/// Provider 领域运行时协调状态。
pub(in crate::core) struct ProviderState {
    /// Global store lock for protecting provider config read-write transactions.
    ///
    /// 全局 store 锁，保护 providers 配置的读写事务。
    store_lock: Mutex<()>,
}

impl ProviderState {
    /// Locks provider store read-write transactions.
    ///
    /// 锁定 provider store 的读写事务，避免并发读改写覆盖。
    pub(in crate::core::bot) fn lock_store(&self) -> MutexGuard<'_, ()> {
        self.store_lock.lock()
    }
}

impl Default for ProviderState {
    /// Creates the default provider state.
    ///
    /// 创建默认 Provider 状态。
    fn default() -> Self {
        Self {
            store_lock: Mutex::new(()),
        }
    }
}
