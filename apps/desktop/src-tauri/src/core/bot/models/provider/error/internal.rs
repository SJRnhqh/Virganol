// apps/desktop/src-tauri/src/core/bot/models/provider/error/internal.rs
use serde::{Serialize, Serializer};
use std::fmt;

use super::ProviderErrorKind;

#[derive(Debug)]
pub(in crate::core::bot) enum ProviderError {
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
    Serde(serde_json::Error),
    Io(String),
    UnsupportedProvider(String),
    LifecycleEventEmit(String),
    LifecycleConcurrentCheck(String),
    Keyring(String),
}

// Downgrades a ProviderError into a warning log rather than propagating to the boundary.
//
// 将 ProviderError 降级为警告日志，不上抛到边界。
crate::impl_downgrade!(ProviderError);

impl fmt::Display for ProviderError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::ConfigNotFound(msg)
            | Self::ConfigStoreOpen(msg)
            | Self::ConfigStorePath(msg)
            | Self::ConfigStoreTempCreate(msg)
            | Self::ConfigStoreWrite(msg)
            | Self::ConfigStoreSync(msg)
            | Self::ConfigStoreReplace(msg)
            | Self::Io(msg)
            | Self::UnsupportedProvider(msg)
            | Self::LifecycleEventEmit(msg)
            | Self::LifecycleConcurrentCheck(msg)
            | Self::Keyring(msg)
            | Self::SecretStoreInit(msg)
            | Self::SecretStoreWrite(msg)
            | Self::SecretStoreRead(msg) => f.write_str(msg),
            Self::JsonSerialize(err)
            | Self::JsonDeserialize(err)
            | Self::ConfigStoreSerialize(err) => write!(f, "{err}"),
            Self::Serde(err) => write!(f, "{err}"),
        }
    }
}

// TODO(Phase 5.2): 覆写 `source()`，将 `Serde` variant 包裹的 `serde_json::Error` 暴露给错误链，
// 或引入 `thiserror` 统一派生，提升错误溯源能力。
impl std::error::Error for ProviderError {}

impl From<serde_json::Error> for ProviderError {
    fn from(err: serde_json::Error) -> Self {
        Self::Serde(err)
    }
}

impl ProviderError {
    pub fn kind(&self) -> ProviderErrorKind {
        match self {
            Self::ConfigNotFound(_) => {
                unreachable!("ConfigNotFound is not part of legacy ProviderErrorKind")
            }
            Self::JsonSerialize(_) => ProviderErrorKind::Serde,
            Self::JsonDeserialize(_) => ProviderErrorKind::Serde,
            Self::ConfigStoreOpen(_) => ProviderErrorKind::Io,
            Self::ConfigStorePath(_) => ProviderErrorKind::Io,
            Self::ConfigStoreSerialize(_) => ProviderErrorKind::Serde,
            Self::ConfigStoreTempCreate(_) => ProviderErrorKind::Io,
            Self::ConfigStoreWrite(_) => ProviderErrorKind::Io,
            Self::ConfigStoreSync(_) => ProviderErrorKind::Io,
            Self::ConfigStoreReplace(_) => ProviderErrorKind::Io,
            Self::Serde(_) => ProviderErrorKind::Serde,
            Self::Io(_) => ProviderErrorKind::Io,
            Self::UnsupportedProvider(_) => ProviderErrorKind::UnsupportedProvider,
            Self::LifecycleEventEmit(_) => ProviderErrorKind::LifecycleEventEmit,
            Self::LifecycleConcurrentCheck(_) => ProviderErrorKind::LifecycleConcurrentCheck,
            Self::Keyring(_) => ProviderErrorKind::Keyring,
            Self::SecretStoreInit(_) => ProviderErrorKind::Keyring,
            Self::SecretStoreWrite(_) => ProviderErrorKind::Keyring,
            Self::SecretStoreRead(_) => ProviderErrorKind::Keyring,
        }
    }

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
