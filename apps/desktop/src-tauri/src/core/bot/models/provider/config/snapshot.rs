// apps/desktop/src-tauri/src/core/bot/models/provider/config/snapshot.rs
use super::super::ProviderId;
use super::ProviderRecord;

/// Provider check snapshot from persisted settings.
///
/// 从持久化配置读取的供应商检查快照。
pub(in crate::core::bot) struct ProviderCheckSnapshot {
    /// Total provider records loaded from storage.
    ///
    /// 从持久化存储读取的供应商记录总数。
    total: usize,
    /// Supported provider records ready for health checks.
    ///
    /// 可进行健康检查的受支持供应商记录。
    supported: Vec<(ProviderId, ProviderRecord)>,
    /// Raw provider identifiers skipped as unsupported.
    ///
    /// 因不受支持而跳过的原始供应商标识。
    skipped: Vec<String>,
}

impl ProviderCheckSnapshot {
    /// Returns the number of provider records loaded from storage.
    ///
    /// 返回从持久化存储读取的供应商记录数量。
    pub(in crate::core::bot) fn total(&self) -> usize {
        self.total
    }

    /// Returns the number of supported provider records.
    ///
    /// 返回受支持的供应商记录数量。
    pub(in crate::core::bot) fn supported_count(&self) -> usize {
        self.supported.len()
    }

    /// Returns the number of unsupported provider records.
    ///
    /// 返回不受支持的供应商记录数量。
    pub(in crate::core::bot) fn skipped_count(&self) -> usize {
        self.skipped.len()
    }

    /// Returns skipped raw provider identifiers.
    ///
    /// 返回跳过的原始供应商标识。
    pub(in crate::core::bot) fn skipped(&self) -> &[String] {
        &self.skipped
    }

    /// Consumes the snapshot and returns supported provider records.
    ///
    /// 消费检查快照并返回受支持的供应商记录。
    pub(in crate::core::bot) fn into_supported(self) -> Vec<(ProviderId, ProviderRecord)> {
        self.supported
    }

    /// Creates a provider check snapshot from classified records.
    ///
    /// 根据已分类的供应商记录创建检查快照。
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
}
