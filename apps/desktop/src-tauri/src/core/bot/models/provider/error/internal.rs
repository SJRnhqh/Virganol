// apps/desktop/src-tauri/src/core/bot/models/provider/error/internal.rs
use keyring::Error as KeyringError;
use reqwest::Error as ReqwestError;
use serde::{Serialize, Serializer};
use serde_json::Error as JsonError;
use std::io::Error as IoError;
use tauri::Error as TauriError;
use tauri_plugin_store::Error as StoreError;
use thiserror::Error;

use super::super::ProviderId;

/// Internal domain error for the provider subsystem.
///
/// Provider 子系统的内部领域错误。
#[derive(Error, Debug)]
pub(in crate::core::bot) enum ProviderError {
    /// Provider manager received a command payload without the expected data section.
    ///
    /// Provider manager 收到缺少预期 data 区块的命令载荷。
    #[error("provider manager request payload is absent for {provider_id}")]
    ManagerRequestPayloadAbsent { provider_id: ProviderId },
    /// Provider check lifecycle started event emission failed.
    ///
    /// Provider 检查生命周期开始事件推送失败。
    #[error("{0}")]
    CheckStartedEmit(String),
    /// Provider check lifecycle status event emission failed.
    ///
    /// Provider 检查生命周期状态事件推送失败。
    #[error("{0}")]
    CheckStatusEmit(String),
    /// Provider check lifecycle completed event emission failed.
    ///
    /// Provider 检查生命周期完成事件推送失败。
    #[error("{0}")]
    CheckCompletedEmit(String),
    /// Provider check lifecycle failed event emission failed.
    ///
    /// Provider 检查生命周期失败事件推送失败。
    #[error("{0}")]
    CheckFailedEmit(String),
    /// Provider check concurrent execution failed (join error or structural issue).
    ///
    /// Provider 并发检查执行失败（join 错误或结构性问题）。
    #[error("{0}")]
    CheckConcurrentFailed(String),
    /// Required health check configuration is missing.
    ///
    /// 健康检查所需配置缺失。
    #[error("provider health check configuration is missing for {provider_id}")]
    HealthCheckMissingConfig { provider_id: ProviderId },
    /// Health check network connection failed.
    ///
    /// 健康检查网络连接失败。
    #[error("provider health check network request failed: {source}")]
    HealthCheckNetwork {
        provider_id: ProviderId,
        #[source]
        source: ReqwestError,
    },
    /// Health check HTTP status indicates failure.
    ///
    /// 健康检查 HTTP 状态码表示失败。
    #[error("provider health check HTTP status indicates failure for {provider_id}")]
    HealthCheckHttp { provider_id: ProviderId },
    /// Health check response format is invalid.
    ///
    /// 健康检查响应格式无效。
    #[error("provider health check response format is invalid: {source}")]
    HealthCheckResponseFormat {
        provider_id: ProviderId,
        #[source]
        source: ReqwestError,
    },
    /// Requested provider has no persisted configuration record.
    ///
    /// 请求的 provider 没有对应的持久化配置记录。
    #[error("provider configuration not found for {provider_id}")]
    ConfigNotFound { provider_id: ProviderId },
    /// Provider configuration failed to serialize into JSON.
    ///
    /// Provider 配置序列化为 JSON 失败。
    #[error("provider configuration failed to serialize: {source}")]
    JsonSerialize {
        provider_id: ProviderId,
        #[source]
        source: JsonError,
    },
    /// Provider configuration failed to deserialize from JSON.
    ///
    /// Provider 配置从 JSON 反序列化失败。
    #[error("provider configuration failed to deserialize: {source}")]
    JsonDeserialize {
        provider_id: Option<ProviderId>,
        #[source]
        source: JsonError,
    },
    /// Provider configuration store could not be opened.
    ///
    /// Provider 配置存储无法打开。
    #[error("provider configuration store could not be opened: {source}")]
    ConfigStoreOpen {
        provider_id: Option<ProviderId>,
        #[source]
        source: StoreError,
    },
    /// Provider configuration store path could not be resolved.
    ///
    /// Provider 配置存储路径无法解析。
    #[error("provider configuration store path could not be resolved: {source}")]
    ConfigStorePath {
        provider_id: ProviderId,
        #[source]
        source: TauriError,
    },
    /// Provider configuration store failed to serialize into JSON bytes.
    ///
    /// Provider 配置存储序列化为 JSON 字节失败。
    #[error("provider configuration store failed to serialize: {source}")]
    ConfigStoreSerialize {
        provider_id: ProviderId,
        #[source]
        source: JsonError,
    },
    /// Provider configuration store temporary file could not be created.
    ///
    /// Provider 配置存储临时文件无法创建。
    #[error("provider configuration store temporary file could not be created: {source}")]
    ConfigStoreTempCreate {
        provider_id: ProviderId,
        #[source]
        source: IoError,
    },
    /// Provider configuration store could not be written.
    ///
    /// Provider 配置存储无法写入。
    #[error("provider configuration store could not be written: {source}")]
    ConfigStoreWrite {
        provider_id: ProviderId,
        #[source]
        source: IoError,
    },
    /// Provider configuration store could not be synced to disk.
    ///
    /// Provider 配置存储无法同步到磁盘。
    #[error("provider configuration store could not be synced to disk: {source}")]
    ConfigStoreSync {
        provider_id: ProviderId,
        #[source]
        source: IoError,
    },
    /// Provider configuration store could not be replaced atomically.
    ///
    /// Provider 配置存储无法原子替换。
    #[error("provider configuration store could not be replaced atomically: {source}")]
    ConfigStoreReplace {
        provider_id: ProviderId,
        #[source]
        source: IoError,
    },
    /// System secret store failed to initialize.
    ///
    /// 系统密钥存储初始化失败。
    #[error("provider secret store could not be initialized: {source}")]
    SecretStoreInit {
        provider_id: ProviderId,
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be written.
    ///
    /// 系统密钥存储无法写入。
    #[error("provider secret store could not be written: {source}")]
    SecretStoreWrite {
        provider_id: ProviderId,
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be read.
    ///
    /// 系统密钥存储无法读取。
    #[error("provider secret store could not be read: {source}")]
    SecretStoreRead {
        provider_id: ProviderId,
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be removed (delete).
    ///
    /// 系统密钥存储无法删除。
    #[error("provider secret store could not be removed: {source}")]
    SecretStoreRemove {
        provider_id: ProviderId,
        #[source]
        source: KeyringError,
    },
    /// Provider id from storage is not supported by the current backend.
    ///
    /// 存储中的 provider id 不被当前后端支持。
    #[error("provider is not supported by the current backend: {raw_provider_id}")]
    UnsupportedProvider { raw_provider_id: String },
}

// Downgrades a ProviderError into a warning log rather than propagating to the boundary.
//
// 将 ProviderError 降级为警告日志，不上抛到边界。
crate::impl_downgrade!(ProviderError);

impl Serialize for ProviderError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}
