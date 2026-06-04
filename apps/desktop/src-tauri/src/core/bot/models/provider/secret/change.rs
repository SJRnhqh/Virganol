// apps/desktop/src-tauri/src/core/bot/models/provider/secret/change.rs
use super::super::ProviderId;
use super::ProviderKey;

/// Describes a keyring key change made by a provider operation.
///
/// 描述一次 Provider 操作已写入 keyring 的前后状态。
pub(in crate::core::bot) struct ProviderKeyChange {
    /// Provider whose keyring entry was changed.
    ///
    /// 本次 keyring 条目变更所属的 Provider。
    provider_id: ProviderId,
    /// Previous key snapshot captured before the write.
    ///
    /// 写入前捕获的旧 key 快照。
    previous_key: Option<ProviderKey>,
    /// New key written by the current operation.
    ///
    /// 本次操作写入的新 key。
    new_key: ProviderKey,
}

impl ProviderKeyChange {
    /// Creates a key change snapshot for a provider keyring write.
    ///
    /// 为一次 Provider keyring 写入创建 key 变更快照。
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

    /// Returns the provider whose keyring entry was changed.
    ///
    /// 返回本次 keyring 条目变更所属的 Provider。
    pub(in crate::core::bot) fn provider_id(&self) -> ProviderId {
        self.provider_id
    }

    /// Returns the previous key snapshot, if one existed before the write.
    ///
    /// 返回写入前的旧 key 快照；如果此前不存在则返回 None。
    pub(in crate::core::bot) fn previous_key(&self) -> Option<&ProviderKey> {
        self.previous_key.as_ref()
    }

    /// Returns the key written by the current operation.
    ///
    /// 返回本次操作写入的新 key。
    pub(in crate::core::bot) fn new_key(&self) -> &ProviderKey {
        &self.new_key
    }
}
