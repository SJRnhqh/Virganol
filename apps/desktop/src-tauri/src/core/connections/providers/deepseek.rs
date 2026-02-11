// apps/desktop/src-tauri/src/core/connections/providers/deepseek.rs

use crate::core::models::llmprovider::{
    ConnectProviderData, ConnectProviderResponse, ProviderInfo,
};
use log::{debug, error, info};
use std::collections::HashMap;

const DEEPSEEK_API_BASE: &str = "https://api.deepseek.com";

/// 连接到 DeepSeek 服务器
///
/// # 参数
/// - `config`: HashMap 包含 api_key
///
/// # 返回
/// - `ConnectProviderResponse`: 连接结果，包含可用模型列表
pub async fn connect(config: HashMap<String, String>) -> ConnectProviderResponse {
    let api_key = match config.get("apiKey") {
        Some(key) if !key.trim().is_empty() => key.trim().to_string(),
        _ => {
            error!("[DeepSeek] Missing apiKey in config");
            return ConnectProviderResponse::error("Missing apiKey in config");
        }
    };

    let models_url = format!("{}/v1/models", DEEPSEEK_API_BASE);
    info!("[DeepSeek] Attempting to connect to: {}", models_url);

    match fetch_deepseek_models(&models_url, &api_key).await {
        Ok(models) => {
            info!(
                "[DeepSeek] Successfully connected. Found {} models: {:?}",
                models.len(),
                models
            );
            ConnectProviderResponse::success(ConnectProviderData {
                connected: true,
                available_models: models,
                provider_info: Some(ProviderInfo {
                    name: "DeepSeek".to_string(),
                    version: None,
                }),
            })
        }
        Err(e) => {
            error!("[DeepSeek] Connection failed: {}", e);
            ConnectProviderResponse::error(format!("Failed to connect to DeepSeek: {}", e))
        }
    }
}

/// 从 DeepSeek 获取可用模型列表
async fn fetch_deepseek_models(models_url: &str, api_key: &str) -> Result<Vec<String>, String> {
    debug!("[DeepSeek] Fetching models from: {}", models_url);

    let response = reqwest::Client::new()
        .get(models_url)
        .bearer_auth(api_key)
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await
        .map_err(|e| {
            let error_msg = format!("HTTP request failed: {}", e);
            error!("[DeepSeek] {}", error_msg);
            error_msg
        })?;

    debug!("[DeepSeek] Response status: {}", response.status());

    if !response.status().is_success() {
        let error_msg = format!("HTTP error: {}", response.status());
        error!("[DeepSeek] {}", error_msg);
        return Err(error_msg);
    }

    let json: serde_json::Value = response.json().await.map_err(|e| {
        let error_msg = format!("Failed to parse JSON: {}", e);
        error!("[DeepSeek] {}", error_msg);
        error_msg
    })?;

    debug!("[DeepSeek] Response JSON: {}", json);

    // OpenAI-compatible format: { "data": [ { "id": "model-id", ... } ] }
    if let Some(models) = json.get("data").and_then(|d| d.as_array()) {
        let model_ids: Vec<String> = models
            .iter()
            .filter_map(|model| model.get("id").and_then(|id| id.as_str()))
            .map(|id| id.to_string())
            .collect();

        if model_ids.is_empty() {
            let error_msg = "No models available in DeepSeek".to_string();
            error!("[DeepSeek] {}", error_msg);
            return Err(error_msg);
        }

        return Ok(model_ids);
    }

    // Fallback: { "models": [ { "name": "..."} ] } or array of strings
    if let Some(models) = json.get("models").and_then(|m| m.as_array()) {
        let model_ids: Vec<String> = models
            .iter()
            .filter_map(|model| {
                model
                    .get("name")
                    .and_then(|name| name.as_str())
                    .or_else(|| model.as_str())
            })
            .map(|name| name.to_string())
            .collect();

        if model_ids.is_empty() {
            let error_msg = "No models available in DeepSeek".to_string();
            error!("[DeepSeek] {}", error_msg);
            return Err(error_msg);
        }

        return Ok(model_ids);
    }

    let error_msg = "No models field in response".to_string();
    error!("[DeepSeek] {}", error_msg);
    Err(error_msg)
}
