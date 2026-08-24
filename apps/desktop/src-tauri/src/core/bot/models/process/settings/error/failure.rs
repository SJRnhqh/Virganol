// apps/desktop/src-tauri/src/core/bot/models/process/settings/error/failure.rs
use serde_json::Error as JsonError;
use std::io::Error as IoError;
use tauri::Error as TauriError;
use tauri_plugin_store::Error as StoreError;
use thiserror::Error;

/// Failure facts defined by the settings process.
///
/// 设置业务过程定义的失败事实。
#[derive(Error, Debug)]
pub(super) enum SettingsFailure {
    /// Settings store could not be opened.
    ///
    /// 设置存储无法打开。
    #[error("settings store could not be opened")]
    StoreOpen {
        /// Underlying store open error.
        ///
        /// 底层存储打开错误。
        #[source]
        source: StoreError,
    },
    /// Settings store path could not be resolved.
    ///
    /// 设置存储路径无法解析。
    #[error("settings store path could not be resolved")]
    StorePath {
        /// Underlying path resolution error.
        ///
        /// 底层路径解析错误。
        #[source]
        source: TauriError,
    },
    /// Settings store could not be serialized.
    ///
    /// 设置存储无法序列化。
    #[error("settings store could not be serialized")]
    StoreSerialize {
        /// Underlying JSON serialization error.
        ///
        /// 底层 JSON 序列化错误。
        #[source]
        source: JsonError,
    },
    /// Settings store temporary file could not be created.
    ///
    /// 设置存储临时文件无法创建。
    #[error("settings store temporary file could not be created")]
    StoreTempCreate {
        /// Underlying file creation error.
        ///
        /// 底层文件创建错误。
        #[source]
        source: IoError,
    },
    /// Settings store file could not be written.
    ///
    /// 设置存储文件无法写入。
    #[error("settings store file could not be written")]
    StoreWrite {
        /// Underlying file write error.
        ///
        /// 底层文件写入错误。
        #[source]
        source: IoError,
    },
    /// Settings store file could not be synced.
    ///
    /// 设置存储文件无法同步。
    #[error("settings store file could not be synced")]
    StoreSync {
        /// Underlying file sync error.
        ///
        /// 底层文件同步错误。
        #[source]
        source: IoError,
    },
    /// Settings store file could not be replaced.
    ///
    /// 设置存储文件无法替换。
    #[error("settings store file could not be replaced")]
    StoreReplace {
        /// Underlying file replace error.
        ///
        /// 底层文件替换错误。
        #[source]
        source: IoError,
    },
}
