// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/mod.rs
// 导出内容
mod config;
mod load;
mod save;

pub(super) use config::{remove_provider, update_models};
pub(self) use load::load_all_providers;
pub(super) use load::{load_provider_record, load_supported_providers};
pub(super) use save::save_provider;

// TODO(post-0.0.1): 考虑添加内存缓存层减少 I/O 放大
// 当前场景（个位数 provider + 低频操作）下影响微乎其微，
// 后续若 provider 数量增多或发现性能瓶颈时再优化。
