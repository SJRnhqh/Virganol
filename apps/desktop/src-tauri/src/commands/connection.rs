// apps/desktop/src-tauri/src/commands/connection.rs

use crate::core::connections::providers;
use crate::core::models::llmprovider::{
    ConnectProviderRequest, ConnectProviderResponse, ProviderId,
};

/// Tauri command: 连接到 LLM Provider
///
/// 这是前端调用的入口点，根据 provider_id 路由到具体的 provider 实现
///
/// # 参数
/// - `request`: 包含 provider_id 和 config 的请求
///
/// # 返回
/// - `ConnectProviderResponse`: 连接结果
#[tauri::command]
pub async fn connect_provider(request: ConnectProviderRequest) -> ConnectProviderResponse {
    // 根据 provider_id 路由到具体的实现
    match request.provider_id {
        ProviderId::Ollama => {
            // 调用 Ollama provider 的 connect 函数
            providers::ollama::connect(request.config).await
        }
        ProviderId::Deepseek => {
            // 暂时返回未实现的错误
            ConnectProviderResponse::error("DeepSeek provider not implemented yet")
        }
    }
}
