// apps/desktop/src-tauri/src/core/settings/store.rs
// 外部依赖
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

pub const SETTINGS_STORE_FILE: &str = "settings.json";

/// 从 settings.json 按 key 读取一段 JSON 值；不存在或读取失败时返回 None。
pub fn load_settings(app: &AppHandle, key: &str) -> Option<serde_json::Value> {
    let store = app.store(SETTINGS_STORE_FILE).ok()?;
    store.get(key)
}

/// 将 JSON 值写入 settings.json 的指定 key（upsert 语义）。
pub fn save_settings(app: &AppHandle, key: &str, value: serde_json::Value) -> Result<(), String> {
    let store = app
        .store(SETTINGS_STORE_FILE)
        .map_err(|error| format!("open settings store failed: {}", error))?;

    store.set(key, value);
    store
        .save()
        .map_err(|error| format!("flush settings store failed: {}", error))?;

    Ok(())
}
