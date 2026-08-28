// apps/desktop/src-tauri/src/core/bot/models/provider/error/failure.rs
use keyring::Error as KeyringError;
use reqwest::Error as ReqwestError;
use serde_json::Error as JsonError;
use strum::{Display, EnumDiscriminants};
use tauri::Error as TauriError;
use thiserror::Error;
use tokio::task::JoinError;

use super::super::super::SettingsError;

/// Failure facts defined by the Provider subject reality.
///
/// 供应商主体实在定义的失败事实。
#[derive(Error, Debug, EnumDiscriminants)]
#[strum_discriminants(vis(pub(in crate::core::bot::models::provider)))]
#[strum_discriminants(name(ProviderFailureKind))]
#[strum_discriminants(strum(serialize_all = "snake_case"))]
#[strum_discriminants(derive(Display))]
pub(super) enum ProviderFailure {
    /// Provider manager command payload is missing required data.
    ///
    /// 供应商管理命令载荷缺少必要数据。
    #[error("provider manager request payload is absent")]
    ManagerRequestPayloadAbsent,
    /// Provider check lifecycle started event emission failed.
    ///
    /// 供应商检查开始事件推送失败。
    #[error("failed to emit provider check started event")]
    CheckStartedEmit {
        /// Underlying Tauri event emission error.
        ///
        /// 底层桌面框架事件推送错误。
        #[source]
        source: TauriError,
    },
    /// Provider check lifecycle status event emission failed.
    ///
    /// 供应商检查状态事件推送失败。
    #[error("failed to emit provider check status event")]
    CheckStatusEmit {
        /// Underlying Tauri event emission error.
        ///
        /// 底层桌面框架事件推送错误。
        #[source]
        source: TauriError,
    },
    /// Provider check lifecycle completed event emission failed.
    ///
    /// 供应商检查完成事件推送失败。
    #[error("failed to emit provider check completed event")]
    CheckCompletedEmit {
        /// Underlying Tauri event emission error.
        ///
        /// 底层桌面框架事件推送错误。
        #[source]
        source: TauriError,
    },
    /// Provider check lifecycle failed event emission failed.
    ///
    /// 供应商检查失败事件推送失败。
    #[error("failed to emit provider check failed event")]
    CheckFailedEmit {
        /// Underlying Tauri event emission error.
        ///
        /// 底层桌面框架事件推送错误。
        #[source]
        source: TauriError,
    },
    /// Provider check task join failed.
    ///
    /// 供应商检查任务汇合失败。
    #[error("provider check task join failed")]
    CheckTaskJoin {
        /// Underlying Tokio task join error.
        ///
        /// 底层异步运行时任务汇合错误。
        #[source]
        source: JoinError,
    },
    /// Provider check collected one or more Provider errors.
    ///
    /// 供应商检查收集到一个或多个供应商级错误。
    #[error("provider check collected provider-level errors")]
    CheckAggregate,
    /// Required health check configuration is missing.
    ///
    /// 健康检查所需配置缺失。
    #[error("provider health check configuration is missing")]
    HealthCheckMissingConfig,
    /// Health check network connection failed.
    ///
    /// 健康检查网络连接失败。
    #[error("provider health check network request failed")]
    HealthCheckNetwork {
        /// Underlying HTTP client request error.
        ///
        /// 底层网络客户端请求错误。
        #[source]
        source: ReqwestError,
    },
    /// Health check HTTP status indicates failure.
    ///
    /// 健康检查响应状态码表示失败。
    #[error("provider health check HTTP status indicates failure")]
    HealthCheckHttp,
    /// Health check response format is invalid.
    ///
    /// 健康检查响应格式无效。
    #[error("provider health check response format is invalid")]
    HealthCheckResponseFormat {
        /// Underlying HTTP response decoding error.
        ///
        /// 底层网络响应解码错误。
        #[source]
        source: ReqwestError,
    },
    /// Stored Provider id is not supported by the current backend.
    ///
    /// 存储中的供应商标识不受当前后端支持。
    #[error("provider is not supported by the current backend")]
    UnsupportedProvider,
    /// Requested Provider has no persisted configuration.
    ///
    /// 请求的供应商没有持久化配置。
    #[error("provider configuration not found")]
    ConfigNotFound,
    /// Provider configuration failed to serialize into JSON.
    ///
    /// 供应商配置序列化为 JSON 失败。
    #[error("provider configuration failed to serialize")]
    JsonSerialize {
        /// Underlying JSON serialization error.
        ///
        /// 底层 JSON 序列化错误。
        #[source]
        source: JsonError,
    },
    /// Provider configuration failed to deserialize from JSON.
    ///
    /// 供应商配置从 JSON 反序列化失败。
    #[error("provider configuration failed to deserialize")]
    JsonDeserialize {
        /// Underlying JSON deserialization error.
        ///
        /// 底层 JSON 反序列化错误。
        #[source]
        source: JsonError,
    },
    /// Provider configuration storage failed at the settings boundary.
    ///
    /// 供应商配置在设置边界存储失败。
    #[error("provider configuration store failed")]
    ConfigStore {
        /// Underlying settings storage error.
        ///
        /// 底层设置存储错误。
        #[source]
        source: SettingsError,
    },
    /// System secret store failed to initialize.
    ///
    /// 系统密钥存储初始化失败。
    #[error("provider secret store could not be initialized")]
    SecretStoreInit {
        /// Underlying Keyring initialization error.
        ///
        /// 底层系统密钥库初始化错误。
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be written.
    ///
    /// 系统密钥存储无法写入。
    #[error("provider secret store could not be written")]
    SecretStoreWrite {
        /// Underlying Keyring write error.
        ///
        /// 底层系统密钥库写入错误。
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be read.
    ///
    /// 系统密钥存储无法读取。
    #[error("provider secret store could not be read")]
    SecretStoreRead {
        /// Underlying Keyring read error.
        ///
        /// 底层系统密钥库读取错误。
        #[source]
        source: KeyringError,
    },
    /// System secret store could not be removed.
    ///
    /// 系统密钥存储无法删除。
    #[error("provider secret store could not be removed")]
    SecretStoreRemove {
        /// Underlying Keyring remove error.
        ///
        /// 底层系统密钥库删除错误。
        #[source]
        source: KeyringError,
    },
}
