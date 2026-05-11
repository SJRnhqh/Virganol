// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/rollback.rs
use super::super::super::super::super::super::ProviderId;
use super::{load_provider_key, remove_provider_key, save_provider_key};

/// Rolls back a keyring key change with CAS protection.
///
/// 回滚 keyring 中的密钥变更（带 CAS 保护）。
pub(crate) fn rollback_provider_key(
    provider_id: ProviderId,
    previous_key: Option<&str>,
    expected_current: &str,
) {
    if load_provider_key(provider_id).as_ref().map(|k| k.as_str()) != Some(expected_current) {
        return;
    }

    let _ = if let Some(key) = previous_key {
        save_provider_key(provider_id, key)
    } else {
        remove_provider_key(provider_id)
    };
}
