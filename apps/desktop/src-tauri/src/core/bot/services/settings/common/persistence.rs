// apps/desktop/src-tauri/src/core/bot/services/settings/common/persistence.rs
// 外部依赖
use std::fs;
use tauri::{AppHandle, Manager};
use tauri_plugin_store::StoreExt;

// 内部引用
use super::super::super::super::{ProviderError, SETTINGS_FILE};

/// 从 settings.json 按 key 读取一段 JSON 值；读取失败时返回 Err，不存在时返回 Ok(None)。
pub(crate) fn load_settings(
    app: &AppHandle,
    key: &str,
) -> Result<Option<serde_json::Value>, ProviderError> {
    let store = app
        .store(SETTINGS_FILE)
        // 上抛settings.json文件打开失败的错误
        .map_err(|error| ProviderError::Io(format!("open settings store failed: {}", error)))?;
    Ok(store.get(key))
}

/// 将 JSON 值写入 settings.json 的指定 key（upsert 语义）。
/// 使用原子写入（temp file + rename）防止崩溃导致文件损坏。
pub(crate) fn save_settings(
    app: &AppHandle,
    key: &str,
    value: serde_json::Value,
) -> Result<(), ProviderError> {
    let store = app
        .store(SETTINGS_FILE)
        .map_err(|error| ProviderError::Io(format!("open settings store failed: {}", error)))?;

    store.set(key, value);

    // 获取 store 文件的实际路径
    let store_path = app
        .path()
        .app_data_dir()
        .map_err(|e| ProviderError::Io(format!("get app data dir failed: {}", e)))?
        .join(SETTINGS_FILE);

    // 生成临时文件路径：原文件名 + .tmp 后缀
    let tmp_filename = format!("{}.tmp", SETTINGS_FILE);
    let tmp_path = store_path.with_file_name(tmp_filename);

    // 序列化所有 store 数据
    let all_data: std::collections::HashMap<String, serde_json::Value> = store
        .entries()
        .iter()
        .map(|(k, v)| (k.clone(), v.clone()))
        .collect();

    let json_bytes = serde_json::to_vec_pretty(&all_data)
        .map_err(|e| ProviderError::Io(format!("serialize store failed: {}", e)))?;

    // 原子写入：先写临时文件，再 rename
    fs::write(&tmp_path, json_bytes)
        .map_err(|e| ProviderError::Io(format!("write temp file failed: {}", e)))?;

    match fs::rename(&tmp_path, &store_path) {
        Ok(_) => Ok(()),
        Err(e) => {
            // 清理临时文件（忽略清理失败）
            let _ = fs::remove_file(&tmp_path);
            Err(ProviderError::Io(format!("atomic rename failed: {}", e)))
        }
    }
}
