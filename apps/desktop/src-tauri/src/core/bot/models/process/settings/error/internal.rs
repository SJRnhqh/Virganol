// apps/desktop/src-tauri/src/core/bot/models/process/settings/error/internal.rs
use serde_json::Error as JsonError;
use std::io::Error as IoError;
use tauri::Error as TauriError;
use tauri_plugin_store::Error as StoreError;
use thiserror::Error;

use super::super::{SettingsErrorContext, SettingsStorageContext};

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

impl SettingsError {
    /// Creates a settings store open error from the storage context.
    ///
    /// 基于存储上下文创建 settings 存储打开错误。
    pub(in crate::core::bot) fn store_open(
        ctx: &SettingsStorageContext,
        source: StoreError,
    ) -> Self {
        Self::StoreOpen {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a settings store path resolution error from the storage context.
    ///
    /// 基于存储上下文创建 settings 存储路径解析错误。
    pub(in crate::core::bot) fn store_path(
        ctx: &SettingsStorageContext,
        source: TauriError,
    ) -> Self {
        Self::StorePath {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a settings store serialization error from the storage context.
    ///
    /// 基于存储上下文创建 settings 存储序列化错误。
    pub(in crate::core::bot) fn store_serialize(
        ctx: &SettingsStorageContext,
        source: JsonError,
    ) -> Self {
        Self::StoreSerialize {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a settings store temporary-file creation error from the storage context.
    ///
    /// 基于存储上下文创建 settings 存储临时文件创建错误。
    pub(in crate::core::bot) fn store_temp_create(
        ctx: &SettingsStorageContext,
        source: IoError,
    ) -> Self {
        Self::StoreTempCreate {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a settings store file write error from the storage context.
    ///
    /// 基于存储上下文创建 settings 存储文件写入错误。
    pub(in crate::core::bot) fn store_write(ctx: &SettingsStorageContext, source: IoError) -> Self {
        Self::StoreWrite {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a settings store file sync error from the storage context.
    ///
    /// 基于存储上下文创建 settings 存储文件同步错误。
    pub(in crate::core::bot) fn store_sync(ctx: &SettingsStorageContext, source: IoError) -> Self {
        Self::StoreSync {
            context: ctx.error_context(),
            source,
        }
    }

    /// Creates a settings store file replace error from the storage context.
    ///
    /// 基于存储上下文创建 settings 存储文件替换错误。
    pub(in crate::core::bot) fn store_replace(
        ctx: &SettingsStorageContext,
        source: IoError,
    ) -> Self {
        Self::StoreReplace {
            context: ctx.error_context(),
            source,
        }
    }
}
