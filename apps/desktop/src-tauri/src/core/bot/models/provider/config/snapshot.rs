// apps/desktop/src-tauri/src/core/bot/models/provider/config/snapshot.rs
use super::super::ProviderId;
use super::ProviderRecord;

/// Provider check snapshot loaded from persisted settings.
///
/// 从持久化配置加载得到的 Provider 检查快照。
pub(in crate::core::bot) struct ProviderCheckSnapshot {
    total: usize,
    supported: Vec<(ProviderId, ProviderRecord)>,
    skipped: Vec<String>,
}

impl ProviderCheckSnapshot {
    /// Creates a provider check snapshot from loaded provider records.
    ///
    /// 基于已加载的 provider 记录创建检查快照。
    pub(in crate::core::bot) fn new(
        total: usize,
        supported: Vec<(ProviderId, ProviderRecord)>,
        skipped: Vec<String>,
    ) -> Self {
        Self {
            total,
            supported,
            skipped,
        }
    }

    /// Returns the number of provider records loaded from storage.
    ///
    /// 返回从持久化存储加载到的 provider 记录数量。
    pub(in crate::core::bot) fn total(&self) -> usize {
        self.total
    }

    /// Returns the number of backend-supported provider records.
    ///
    /// 返回后端支持的 provider 记录数量。
    pub(in crate::core::bot) fn supported_count(&self) -> usize {
        self.supported.len()
    }

    /// Returns the number of unsupported provider records.
    ///
    /// 返回不受支持的 provider 记录数量。
    pub(in crate::core::bot) fn skipped_count(&self) -> usize {
        self.skipped.len()
    }

    /// Returns unsupported provider raw ids.
    ///
    /// 返回不受支持的 provider 原始 id。
    pub(in crate::core::bot) fn skipped(&self) -> &[String] {
        &self.skipped
    }

    /// Consumes the snapshot and returns supported provider records.
    ///
    /// 消费检查快照并返回受支持的 provider 记录。
    pub(in crate::core::bot) fn into_supported(self) -> Vec<(ProviderId, ProviderRecord)> {
        self.supported
    }
}
