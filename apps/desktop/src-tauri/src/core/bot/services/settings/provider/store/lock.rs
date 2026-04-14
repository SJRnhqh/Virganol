// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/lock.rs
// 外部依赖
use std::sync::Mutex;

// 写操作互斥锁；后续可评估迁移至 Tauri State<Mutex<T>> 统一管理生命周期（见 ROADMAP Phase 6.2）。
pub(super) static PROVIDERS_STORE_LOCK: Mutex<()> = Mutex::new(());
