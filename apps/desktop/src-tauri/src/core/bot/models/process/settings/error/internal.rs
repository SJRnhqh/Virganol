// apps/desktop/src-tauri/src/core/bot/models/process/settings/error/internal.rs
use serde_json::Error as JsonError;
use std::io::Error as IoError;
use tauri::Error as TauriError;
use tauri_plugin_store::Error as StoreError;
use thiserror::Error;

use super::super::SettingsErrorContext;

/// Internal process error for the settings module.
///
/// settings 模块的内部过程错误。
#[derive(Error, Debug)]
pub(in crate::core::bot) enum SettingsError {
    /// Settings store could not be opened.
    ///
    /// settings 存储无法打开。
    #[error("settings store could not be opened: {source}")]
    StoreOpen {
        /// Settings error attribution context.
        ///
        /// settings 错误归因上下文。
        context: SettingsErrorContext,
        /// Settings store open error.
        ///
        /// settings 存储打开错误。
        #[source]
        source: StoreError,
    },
    /// Settings store path could not be resolved.
    ///
    /// settings 存储路径无法解析。
    #[error("settings store path could not be resolved: {source}")]
    StorePath {
        /// Settings error attribution context.
        ///
        /// settings 错误归因上下文。
        context: SettingsErrorContext,
        /// Settings store path resolution error.
        ///
        /// settings 存储路径解析错误。
        #[source]
        source: TauriError,
    },
    /// Settings store could not be serialized.
    ///
    /// settings 存储无法序列化。
    #[error("settings store could not be serialized: {source}")]
    StoreSerialize {
        /// Settings error attribution context.
        ///
        /// settings 错误归因上下文。
        context: SettingsErrorContext,
        /// Settings store serialization error.
        ///
        /// settings 存储序列化错误。
        #[source]
        source: JsonError,
    },
    /// Settings store temporary file could not be created.
    ///
    /// settings 存储临时文件无法创建。
    #[error("settings store temporary file could not be created: {source}")]
    StoreTempCreate {
        /// Settings error attribution context.
        ///
        /// settings 错误归因上下文。
        context: SettingsErrorContext,
        /// Settings store temporary file creation error.
        ///
        /// settings 存储临时文件创建错误。
        #[source]
        source: IoError,
    },
    /// Settings store file could not be written.
    ///
    /// settings 存储文件无法写入。
    #[error("settings store file could not be written: {source}")]
    StoreWrite {
        /// Settings error attribution context.
        ///
        /// settings 错误归因上下文。
        context: SettingsErrorContext,
        /// Settings store file write error.
        ///
        /// settings 存储文件写入错误。
        #[source]
        source: IoError,
    },
    /// Settings store file could not be synced.
    ///
    /// settings 存储文件无法同步。
    #[error("settings store file could not be synced: {source}")]
    StoreSync {
        /// Settings error attribution context.
        ///
        /// settings 错误归因上下文。
        context: SettingsErrorContext,
        /// Settings store file sync error.
        ///
        /// settings 存储文件同步错误。
        #[source]
        source: IoError,
    },
    /// Settings store file could not be replaced.
    ///
    /// settings 存储文件无法替换。
    #[error("settings store file could not be replaced: {source}")]
    StoreReplace {
        /// Settings error attribution context.
        ///
        /// settings 错误归因上下文。
        context: SettingsErrorContext,
        /// Settings store file replace error.
        ///
        /// settings 存储文件替换错误。
        #[source]
        source: IoError,
    },
}
