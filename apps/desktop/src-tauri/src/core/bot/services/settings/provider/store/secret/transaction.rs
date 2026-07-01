// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/secret/transaction.rs
use super::super::super::super::super::super::super::Downgrade;
use super::super::super::super::super::super::{
    ProviderError, ProviderExecutionContext, ProviderId, ProviderKey, ProviderKeyChange,
};
use super::{load_provider_key, remove_provider_key, save_provider_key};

/// Best-effort transaction guard for provider keyring writes.
///
/// 供应商密钥写入的补偿事务守卫，未提交时自动回滚。
pub(in crate::core::bot::services::settings::provider) struct ProviderKeyTransaction {
    ctx: ProviderExecutionContext,
    change: Option<ProviderKeyChange>,
}

impl ProviderKeyTransaction {
    /// Starts a key transaction by saving the new key and capturing the previous one.
    ///
    /// 保存新密钥并捕获旧密钥，启动密钥事务。
    pub(in crate::core::bot::services::settings::provider) fn begin(
        ctx: ProviderExecutionContext,
        provider_id: ProviderId,
        normalized_key: &str,
    ) -> Result<Option<Self>, ProviderError> {
        if normalized_key.is_empty() {
            return Ok(None);
        }

        let previous_key = load_provider_key(&ctx, provider_id);
        let new_key = ProviderKey::new(normalized_key.to_string());
        save_provider_key(&ctx, provider_id, new_key.as_str())?;

        Ok(Some(Self {
            ctx,
            change: Some(ProviderKeyChange::new(provider_id, previous_key, new_key)),
        }))
    }

    /// Commits the key transaction and disables rollback on drop.
    ///
    /// 提交密钥事务，并在释放时跳过回滚。
    pub(in crate::core::bot::services::settings::provider) fn commit(mut self) {
        self.change.take();
    }
}

impl Drop for ProviderKeyTransaction {
    /// Rolls back the keyring write when the transaction was not committed.
    ///
    /// 事务未提交时回滚系统密钥库写入。
    fn drop(&mut self) {
        let Some(change) = self.change.as_ref() else {
            return;
        };

        let provider_id = change.provider_id();
        let expected_current = change.new_key().as_str();
        let current_matches = load_provider_key(&self.ctx, provider_id)
            .as_ref()
            .map(|k| k.as_str())
            == Some(expected_current);

        if !current_matches {
            log::warn!(
                "[Tauri] skip key rollback for {}; current key changed",
                provider_id.as_str()
            );
            return;
        }

        let result = if let Some(previous_key) = change.previous_key() {
            save_provider_key(&self.ctx, provider_id, previous_key.as_str())
        } else {
            remove_provider_key(&self.ctx, provider_id)
        };

        if let Err(e) = result {
            e.downgrade();
        }
    }
}
