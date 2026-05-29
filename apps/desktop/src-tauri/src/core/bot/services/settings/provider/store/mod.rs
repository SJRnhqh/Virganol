// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/mod.rs
mod config;
mod secret;

pub(super) use config::{
    load_provider_check_snapshot, load_provider_record, remove_provider, save_provider,
    update_models,
};
pub(super) use secret::{remove_provider_key, resolve_provider_key, ProviderKeyTransaction};

// TODO(post-0.0.1): 考虑添加内存缓存层减少 I/O 放大
// 当前场景（个位数 provider + 低频操作）下影响微乎其微，
// 后续若 provider 数量增多或发现性能瓶颈时再优化。
