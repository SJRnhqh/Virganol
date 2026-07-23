// apps/desktop/src-tauri/src/core/bot/constants/provider/scope.rs

/// Complete Provider business scopes for one execution stage.
///
/// 单个 Provider 执行阶段对应的完整业务范围集合。
pub(in crate::core::bot) struct ProviderStageScopes {
    /// Scope for the Provider connect operation.
    ///
    /// Provider 连接操作对应的业务范围。
    connect: &'static str,
    /// Scope for the Provider reset operation.
    ///
    /// Provider 重置操作对应的业务范围。
    reset: &'static str,
    /// Scope for the Provider enabled-model update operation.
    ///
    /// Provider 启用模型更新操作对应的业务范围。
    update_models: &'static str,
    /// Scope for the Provider lifecycle health-check operation.
    ///
    /// Provider 生命周期健康检查操作对应的业务范围。
    lifecycle_check: &'static str,
}

impl ProviderStageScopes {
    /// Returns the scope for the Provider connect operation.
    ///
    /// 返回 Provider 连接操作对应的业务范围。
    pub(in crate::core::bot) fn connect(&self) -> &'static str {
        self.connect
    }

    /// Returns the scope for the Provider reset operation.
    ///
    /// 返回 Provider 重置操作对应的业务范围。
    pub(in crate::core::bot) fn reset(&self) -> &'static str {
        self.reset
    }

    /// Returns the scope for the Provider enabled-model update operation.
    ///
    /// 返回 Provider 启用模型更新操作对应的业务范围。
    pub(in crate::core::bot) fn update_models(&self) -> &'static str {
        self.update_models
    }

    /// Returns the scope for the Provider lifecycle health-check operation.
    ///
    /// 返回 Provider 生命周期健康检查操作对应的业务范围。
    pub(in crate::core::bot) fn lifecycle_check(&self) -> &'static str {
        self.lifecycle_check
    }
}

/// Complete Provider scopes observed at the manager orchestration stage.
///
/// Provider manager 编排阶段对应的完整业务范围集合。
pub(in crate::core::bot) const PROVIDER_MANAGER_SCOPES: ProviderStageScopes = ProviderStageScopes {
    connect: "provider.manager.connect",
    reset: "provider.manager.reset",
    update_models: "provider.manager.update_models",
    lifecycle_check: "provider.manager.lifecycle_check",
};

/// Complete Provider scopes observed at the lifecycle event emission stage.
///
/// Provider 生命周期事件推送阶段对应的完整业务范围集合。
pub(in crate::core::bot) const PROVIDER_LIFECYCLE_EMIT_SCOPES: ProviderStageScopes =
    ProviderStageScopes {
        connect: "provider.lifecycle_emit.connect",
        reset: "provider.lifecycle_emit.reset",
        update_models: "provider.lifecycle_emit.update_models",
        lifecycle_check: "provider.lifecycle_emit.lifecycle_check",
    };

/// Complete Provider scopes observed at the connection stage.
///
/// Provider 连接阶段对应的完整业务范围集合。
pub(in crate::core::bot) const PROVIDER_CONNECTION_SCOPES: ProviderStageScopes =
    ProviderStageScopes {
        connect: "provider.connection.connect",
        reset: "provider.connection.reset",
        update_models: "provider.connection.update_models",
        lifecycle_check: "provider.connection.lifecycle_check",
    };

/// Complete Provider scopes observed at the config store stage.
///
/// Provider 配置存储阶段对应的完整业务范围集合。
pub(in crate::core::bot) const PROVIDER_CONFIG_STORE_SCOPES: ProviderStageScopes =
    ProviderStageScopes {
        connect: "provider.config_store.connect",
        reset: "provider.config_store.reset",
        update_models: "provider.config_store.update_models",
        lifecycle_check: "provider.config_store.lifecycle_check",
    };

/// Complete Provider scopes observed at the secret store stage.
///
/// Provider 密钥存储阶段对应的完整业务范围集合。
pub(in crate::core::bot) const PROVIDER_SECRET_STORE_SCOPES: ProviderStageScopes =
    ProviderStageScopes {
        connect: "provider.secret_store.connect",
        reset: "provider.secret_store.reset",
        update_models: "provider.secret_store.update_models",
        lifecycle_check: "provider.secret_store.lifecycle_check",
    };
