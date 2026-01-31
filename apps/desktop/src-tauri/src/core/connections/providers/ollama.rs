// apps/desktop/src-tauri/src/core/connections/providers/ollama.rs

use crate::core::models::llmprovider::{
    ConnectProviderData, ConnectProviderResponse, ProviderInfo,
};
use std::collections::HashMap;

/// 连接到 Ollama 服务器
///
/// # 参数
/// - `config`: HashMap 包含 api_url 和可选的 api_key
///
/// # 返回
/// - `ConnectProviderResponse`: 连接结果，包含可用模型列表
pub async fn connect(config: HashMap<String, String>) -> ConnectProviderResponse {
    // 1. 从 config 中提取 api_url
    let api_url = match config.get("apiURL") {
        Some(url) => url.clone(),
        None => {
            return ConnectProviderResponse::error("Missing apiURL in config");
        }
    };

    // 2. 验证 URL 格式
    if !api_url.starts_with("http://") && !api_url.starts_with("https://") {
        return ConnectProviderResponse::error("Invalid API URL format");
    }

    // 3. 尝试连接到 Ollama 并获取模型列表
    match fetch_ollama_models(&api_url).await {
        Ok(models) => {
            // 连接成功，返回可用模型列表
            ConnectProviderResponse::success(ConnectProviderData {
                connected: true,
                available_models: models,
                provider_info: Some(ProviderInfo {
                    name: "Ollama".to_string(),
                    version: None,
                }),
            })
        }
        Err(e) => {
            // 连接失败，返回错误信息
            ConnectProviderResponse::error(format!("Failed to connect to Ollama: {}", e))
        }
    }
}

/// 从 Ollama 服务器获取可用的模型列表
///
/// # 参数
/// - `api_url`: Ollama 服务器的 URL（如 http://localhost:11434）
///
/// # 返回
/// - `Result<Vec<String>, String>`: 模型名称列表或错误信息
async fn fetch_ollama_models(api_url: &str) -> Result<Vec<String>, String> {
    // 构建请求 URL
    let url = format!("{}/api/tags", api_url);

    // 发送 HTTP GET 请求
    let response = reqwest::Client::new()
        .get(&url)
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await
        .map_err(|e| format!("HTTP request failed: {}", e))?;

    // 检查响应状态
    if !response.status().is_success() {
        return Err(format!("HTTP error: {}", response.status()));
    }

    // 解析 JSON 响应
    let json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse JSON: {}", e))?;

    // 提取模型列表
    let models = json
        .get("models")
        .and_then(|m| m.as_array())
        .ok_or_else(|| "No models field in response".to_string())?;

    // 提取每个模型的名称
    let model_names: Vec<String> = models
        .iter()
        .filter_map(|model| {
            model
                .get("name")
                .and_then(|n| n.as_str())
                .map(|s| s.to_string())
        })
        .collect();

    if model_names.is_empty() {
        return Err("No models available in Ollama".to_string());
    }

    Ok(model_names)
}
