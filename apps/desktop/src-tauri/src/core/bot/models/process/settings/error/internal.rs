// apps/desktop/src-tauri/src/core/bot/models/process/settings/error/internal.rs
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
}
