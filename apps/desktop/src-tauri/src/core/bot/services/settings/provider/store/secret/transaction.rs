// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/transaction.rs
use super::super::super::super::super::super::{
    ProviderError, ProviderId, ProviderKey, ProviderKeyChange,
};
use super::{load_provider_key, remove_provider_key, save_provider_key};

/// Best-effort transaction guard for provider keyring writes.
///
/// Provider keyring 写入的补偿事务守卫：未 commit 时自动回滚。
pub(crate) struct ProviderKeyTransaction {
    change: Option<ProviderKeyChange>,
}

impl ProviderKeyTransaction {
    /// Starts a provider key transaction by writing the new key and capturing the previous key.
    ///
    /// 通过写入新 Key 并捕获旧 Key，启动一次 provider key 事务。
    pub(crate) fn begin(
        provider_id: ProviderId,
        normalized_key: &str,
    ) -> Result<Option<Self>, ProviderError> {
        if normalized_key.is_empty() {
            return Ok(None);
        }

        let previous_key = load_provider_key(provider_id);
        let new_key = ProviderKey::new(normalized_key.to_string());
        save_provider_key(provider_id, new_key.as_str())?;

        Ok(Some(Self {
            change: Some(ProviderKeyChange::new(provider_id, previous_key, new_key)),
        }))
    }

    /// Commits the key transaction and prevents automatic rollback on drop.
    ///
    /// 提交 Key 事务，并阻止释放时自动回滚。
    pub(crate) fn commit(mut self) {
        self.change.take();
    }
}

impl Drop for ProviderKeyTransaction {
    /// Rolls back the keyring write if the transaction was not committed.
    ///
    /// 如果事务未提交，则在释放时回滚 keyring 写入。
    fn drop(&mut self) {
        let Some(change) = self.change.as_ref() else {
            return;
        };

        let provider_id = change.provider_id();
        let expected_current = change.new_key().as_str();
        let current_matches = load_provider_key(provider_id)
            .as_ref()
            .map(|key| key.as_str())
            == Some(expected_current);

        if !current_matches {
            log::warn!(
                "[Tauri] skip key rollback for {}; current key changed",
                provider_id.as_str()
            );
            return;
        }

        let result = if let Some(previous_key) = change.previous_key() {
            save_provider_key(provider_id, previous_key.as_str())
        } else {
            remove_provider_key(provider_id)
        };

        if let Err(error) = result {
            log::warn!(
                "[Tauri] rollback key failed for {}: {}",
                provider_id.as_str(),
                error
            );
        }
    }
}
