// apps/desktop/src-tauri/src/core/bot/models/provider/context/base.rs
use super::super::ProviderId;
use super::{ProviderErrorContext, ProviderOperation, ProviderStage};

/// Provider-domain reliability context.
///
/// Provider 领域可靠性上下文，用领域语言标记一次 Provider 操作的执行处境。
pub(super) struct ProviderContext<T = ()> {
    /// Provider targeted by this execution, when it can be attributed to one provider.
    ///
    /// 当本次执行可归属到单个 Provider 时携带对应 Provider ID。
    pub(super) provider_id: Option<ProviderId>,
    /// Provider-domain operation currently being executed.
    ///
    /// 当前正在执行的 Provider 领域操作。
    pub(super) operation: ProviderOperation,
    /// Provider-domain execution stage currently reached.
    ///
    /// 当前抵达的 Provider 领域执行阶段。
    pub(super) stage: ProviderStage,
    /// Link-specific reliability metadata.
    ///
    /// 具体链路携带的可靠性元信息。
    pub(super) extra: T,
}

impl<T> ProviderContext<T> {
    /// Derives this context at the config-store stage.
    ///
    /// 将当前上下文派生到配置存储阶段。
    pub(super) fn at_config_store(self) -> Self {
        self.at_stage(ProviderStage::ConfigStore)
    }

    /// Derives this context at the secret-store stage.
    ///
    /// 将当前上下文派生到密钥存储阶段。
    pub(super) fn at_secret_store(self) -> Self {
        self.at_stage(ProviderStage::SecretStore)
    }

    /// Derives this context at the connection stage.
    ///
    /// 将当前上下文派生到连接阶段。
    pub(super) fn at_connection(self) -> Self {
        self.at_stage(ProviderStage::Connection)
    }

    /// Projects this context into an error attribution snapshot.
    ///
    /// 将当前执行上下文投影为错误归因快照。
    pub(super) fn error_context(&self) -> ProviderErrorContext {
        ProviderErrorContext::from_parts(self.provider_id, self.stage)
    }

    /// Reuses the current context identity at another execution stage.
    ///
    /// 在另一个执行阶段复用当前上下文身份。
    fn at_stage(self, stage: ProviderStage) -> Self {
        Self {
            provider_id: self.provider_id,
            operation: self.operation,
            stage,
            extra: self.extra,
        }
    }
}
