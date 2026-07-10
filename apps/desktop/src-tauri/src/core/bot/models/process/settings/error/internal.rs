// apps/desktop/src-tauri/src/core/bot/models/process/settings/error/internal.rs
use serde_json::Error as JsonError;
use std::{error::Error as StdError, fmt, io::Error as IoError};
use tauri::Error as TauriError;
use tauri_plugin_store::Error as StoreError;

use super::super::{SettingsErrorContext, SettingsStorageContext};
use super::SettingsFailure;

/// Internal error for the settings process.
///
/// 设置业务过程内部错误。
#[derive(Debug)]
pub(in crate::core::bot) struct SettingsError {
    /// Settings error attribution snapshot.
    ///
    /// 设置错误归因快照。
    context: SettingsErrorContext,
    /// Settings failure fact.
    ///
    /// 设置失败事实。
    failure: SettingsFailure,
}

impl SettingsError {
    /// Creates a settings store open error from the storage context.
    ///
    /// 基于存储上下文创建设置存储打开错误。
    pub(in crate::core::bot) fn store_open(
        ctx: &SettingsStorageContext,
        source: StoreError,
    ) -> Self {
        Self::new(ctx.error_context(), SettingsFailure::StoreOpen { source })
    }

    /// Creates a settings store path resolution error from the storage context.
    ///
    /// 基于存储上下文创建设置存储路径解析错误。
    pub(in crate::core::bot) fn store_path(
        ctx: &SettingsStorageContext,
        source: TauriError,
    ) -> Self {
        Self::new(ctx.error_context(), SettingsFailure::StorePath { source })
    }

    /// Creates a settings store serialization error from the storage context.
    ///
    /// 基于存储上下文创建设置存储序列化错误。
    pub(in crate::core::bot) fn store_serialize(
        ctx: &SettingsStorageContext,
        source: JsonError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            SettingsFailure::StoreSerialize { source },
        )
    }

    /// Creates a settings store temporary-file creation error from the storage context.
    ///
    /// 基于存储上下文创建设置存储临时文件创建错误。
    pub(in crate::core::bot) fn store_temp_create(
        ctx: &SettingsStorageContext,
        source: IoError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            SettingsFailure::StoreTempCreate { source },
        )
    }

    /// Creates a settings store file write error from the storage context.
    ///
    /// 基于存储上下文创建设置存储文件写入错误。
    pub(in crate::core::bot) fn store_write(ctx: &SettingsStorageContext, source: IoError) -> Self {
        Self::new(ctx.error_context(), SettingsFailure::StoreWrite { source })
    }

    /// Creates a settings store file sync error from the storage context.
    ///
    /// 基于存储上下文创建设置存储文件同步错误。
    pub(in crate::core::bot) fn store_sync(ctx: &SettingsStorageContext, source: IoError) -> Self {
        Self::new(ctx.error_context(), SettingsFailure::StoreSync { source })
    }

    /// Creates a settings store file replace error from the storage context.
    ///
    /// 基于存储上下文创建设置存储文件替换错误。
    pub(in crate::core::bot) fn store_replace(
        ctx: &SettingsStorageContext,
        source: IoError,
    ) -> Self {
        Self::new(
            ctx.error_context(),
            SettingsFailure::StoreReplace { source },
        )
    }

    /// Returns the Settings failure fact.
    ///
    /// 返回设置失败事实。
    pub(in crate::core::bot) fn failure(&self) -> &SettingsFailure {
        &self.failure
    }

    /// Creates an internal settings error.
    ///
    /// 创建设置内部错误。
    fn new(context: SettingsErrorContext, failure: SettingsFailure) -> Self {
        Self { context, failure }
    }
}

impl fmt::Display for SettingsError {
    /// Formats the attributed settings error.
    ///
    /// 格式化已归因的设置错误。
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} for {}", self.failure, self.context)?;

        if let Some(source) = self.failure.source() {
            write!(f, ": {source}")?;
        }

        Ok(())
    }
}

impl StdError for SettingsError {
    /// Returns the underlying error source.
    ///
    /// 返回底层错误源。
    fn source(&self) -> Option<&(dyn StdError + 'static)> {
        self.failure.source()
    }
}
