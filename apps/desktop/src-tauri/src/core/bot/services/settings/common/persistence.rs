// apps/desktop/src-tauri/src/core/bot/services/settings/common/persistence.rs
// 外部依赖
use std::fs::{self, File};
use std::io::Write;
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

    // 原子写入第一步：写 tmp + fsync，确保内容和元数据真正落盘而非停留在 OS page cache。
    // 断电/崩溃后即便 rename 生效，没 fsync 的内容可能只是半截 JSON 或空文件。
    {
        let mut file = File::create(&tmp_path)
            .map_err(|e| ProviderError::Io(format!("create temp file failed: {}", e)))?;
        file.write_all(&json_bytes)
            .map_err(|e| ProviderError::Io(format!("write temp file failed: {}", e)))?;
        file.sync_all()
            .map_err(|e| ProviderError::Io(format!("fsync temp file failed: {}", e)))?;
    }

    // 原子写入第二步：rename 切换到正式文件名（同一文件系统内原子）
    if let Err(e) = fs::rename(&tmp_path, &store_path) {
        // 清理临时文件（忽略清理失败）
        let _ = fs::remove_file(&tmp_path);
        return Err(ProviderError::Io(format!("atomic rename failed: {}", e)));
    }

    // 原子写入第三步：fsync 父目录，确保 rename 的目录项变更也落盘。
    // Windows 不支持目录 fsync，silent ignore 保持跨平台兼容，
    // 类 Unix 系统上一旦目录打开失败或 sync_all 失败都不阻塞主流程（写入本身已成功）。
    if let Some(parent) = store_path.parent() {
        if let Ok(dir) = File::open(parent) {
            let _ = dir.sync_all();
        }
    }

    Ok(())
}
