// apps/desktop/src-tauri/src/core/bot/models/provider/secret/change.rs
use super::super::ProviderId;
use super::ProviderKey;

/// Describes a keyring key change made by a provider operation.
///
/// 描述一次供应商操作写入系统密钥库前后的状态。
pub(in crate::core::bot) struct ProviderKeyChange {
    /// Provider whose keyring entry was changed.
    ///
    /// 本次系统密钥库条目变更所属的供应商。
    provider_id: ProviderId,
    /// Previous key snapshot captured before the write.
    ///
    /// 写入前捕获的旧密钥快照。
    previous_key: Option<ProviderKey>,
    /// New key written by the current operation.
    ///
    /// 本次操作写入的新密钥。
    new_key: ProviderKey,
}

impl ProviderKeyChange {
    /// Returns the provider whose keyring entry was changed.
    ///
    /// 返回本次系统密钥库条目变更所属的供应商。
    pub(in crate::core::bot) fn provider_id(&self) -> ProviderId {
        self.provider_id
    }

    /// Returns the previous key snapshot, if one existed before the write.
    ///
    /// 返回写入前的旧密钥快照；如果此前不存在则返回空值。
    pub(in crate::core::bot) fn previous_key(&self) -> Option<&ProviderKey> {
        self.previous_key.as_ref()
    }

    /// Returns the key written by the current operation.
    ///
    /// 返回本次操作写入的新密钥。
    pub(in crate::core::bot) fn new_key(&self) -> &ProviderKey {
        &self.new_key
    }

    /// Creates a key change snapshot for a provider keyring write.
    ///
    /// 为一次供应商系统密钥库写入创建密钥变更快照。
    pub(in crate::core::bot) fn new(
        provider_id: ProviderId,
        previous_key: Option<ProviderKey>,
        new_key: ProviderKey,
    ) -> Self {
        Self {
            provider_id,
            previous_key,
            new_key,
        }
    }
}
