// apps/desktop/src-tauri/src/core/bot/models/provider/error/internal.rs
use serde::{Serialize, Serializer};
use std::fmt;

/// Internal domain error for the provider subsystem.
///
/// Provider 子系统的内部领域错误。
#[derive(Debug)]
pub(in crate::core::bot) enum ProviderError {
    /// Provider check lifecycle started event emission failed.
    ///
    /// Provider 检查生命周期开始事件推送失败。
    CheckStartedEmit(String),
    /// Provider check lifecycle status event emission failed.
    ///
    /// Provider 检查生命周期状态事件推送失败。
    CheckStatusEmit(String),
    /// Provider check lifecycle completed event emission failed.
    ///
    /// Provider 检查生命周期完成事件推送失败。
    CheckCompletedEmit(String),
    /// Provider check lifecycle failed event emission failed.
    ///
    /// Provider 检查生命周期失败事件推送失败。
    CheckFailedEmit(String),
    /// Provider check concurrent execution failed (join error or structural issue).
    ///
    /// Provider 并发检查执行失败（join 错误或结构性问题）。
    CheckConcurrentFailed(String),
    /// Provider id from storage is not supported by the current backend.
    ///
    /// 存储中的 provider id 不被当前后端支持。
    UnsupportedProvider(String),
    /// Required health check configuration is missing.
    ///
    /// 健康检查所需配置缺失。
    HealthCheckMissingConfig(String),
    /// Health check network connection failed.
    ///
    /// 健康检查网络连接失败。
    HealthCheckNetwork(String),
    /// Health check HTTP status indicates failure.
    ///
    /// 健康检查 HTTP 状态码表示失败。
    HealthCheckHttp(String),
    /// Health check response format is invalid.
    ///
    /// 健康检查响应格式无效。
    HealthCheckResponseFormat(String),
    /// Requested provider has no persisted configuration record.
    ///
    /// 请求的 provider 没有对应的持久化配置记录。
    ConfigNotFound(String),
    /// Provider configuration failed to serialize into JSON.
    ///
    /// Provider 配置序列化为 JSON 失败。
    JsonSerialize(serde_json::Error),
    /// Provider configuration failed to deserialize from JSON.
    ///
    /// Provider 配置从 JSON 反序列化失败。
    JsonDeserialize(serde_json::Error),
    /// Provider configuration store could not be opened.
    ///
    /// Provider 配置存储无法打开。
    ConfigStoreOpen(String),
    /// Provider configuration store path could not be resolved.
    ///
    /// Provider 配置存储路径无法解析。
    ConfigStorePath(String),
    /// Provider configuration store failed to serialize into JSON bytes.
    ///
    /// Provider 配置存储序列化为 JSON 字节失败。
    ConfigStoreSerialize(serde_json::Error),
    /// Provider configuration store temporary file could not be created.
    ///
    /// Provider 配置存储临时文件无法创建。
    ConfigStoreTempCreate(String),
    /// Provider configuration store could not be written.
    ///
    /// Provider 配置存储无法写入。
    ConfigStoreWrite(String),
    /// Provider configuration store could not be synced to disk.
    ///
    /// Provider 配置存储无法同步到磁盘。
    ConfigStoreSync(String),
    /// Provider configuration store could not be replaced atomically.
    ///
    /// Provider 配置存储无法原子替换。
    ConfigStoreReplace(String),
    /// System secret store failed to initialize.
    ///
    /// 系统密钥存储初始化失败。
    SecretStoreInit(String),
    /// System secret store could not be written.
    ///
    /// 系统密钥存储无法写入。
    SecretStoreWrite(String),
    /// System secret store could not be read.
    ///
    /// 系统密钥存储无法读取。
    SecretStoreRead(String),
    /// System secret store could not be removed (delete).
    ///
    /// 系统密钥存储无法删除。
    SecretStoreRemove(String),
}

// Downgrades a ProviderError into a warning log rather than propagating to the boundary.
//
// 将 ProviderError 降级为警告日志，不上抛到边界。
crate::impl_downgrade!(ProviderError);

impl fmt::Display for ProviderError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::CheckStartedEmit(msg)
            | Self::CheckStatusEmit(msg)
            | Self::CheckCompletedEmit(msg)
            | Self::CheckFailedEmit(msg)
            | Self::CheckConcurrentFailed(msg)
            | Self::HealthCheckMissingConfig(msg)
            | Self::HealthCheckNetwork(msg)
            | Self::HealthCheckHttp(msg)
            | Self::HealthCheckResponseFormat(msg)
            | Self::ConfigNotFound(msg)
            | Self::ConfigStoreOpen(msg)
            | Self::ConfigStorePath(msg)
            | Self::ConfigStoreTempCreate(msg)
            | Self::ConfigStoreWrite(msg)
            | Self::ConfigStoreSync(msg)
            | Self::ConfigStoreReplace(msg)
            | Self::UnsupportedProvider(msg)
            | Self::SecretStoreInit(msg)
            | Self::SecretStoreWrite(msg)
            | Self::SecretStoreRead(msg)
            | Self::SecretStoreRemove(msg) => f.write_str(msg),
            Self::JsonSerialize(err)
            | Self::JsonDeserialize(err)
            | Self::ConfigStoreSerialize(err) => write!(f, "{err}"),
        }
    }
}

// TODO(Phase 5.2): 覆写 `source()`，将 `Serde` variant 包裹的 `serde_json::Error` 暴露给错误链，
// 或引入 `thiserror` 统一派生，提升错误溯源能力。
impl std::error::Error for ProviderError {}

impl ProviderError {
    pub fn message(&self) -> String {
        self.to_string()
    }
}

impl Serialize for ProviderError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}
