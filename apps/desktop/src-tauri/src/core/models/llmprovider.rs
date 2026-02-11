// apps/desktop/src-tauri/src/core/models/llmprovider.rs

use serde::{Deserialize, Serialize};

/// Provider ID 类型
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ProviderId {
    Ollama,
    Deepseek,
}

impl std::fmt::Display for ProviderId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ProviderId::Ollama => write!(f, "ollama"),
            ProviderId::Deepseek => write!(f, "deepseek"),
        }
    }
}

/// 连接请求
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectProviderRequest {
    pub provider_id: ProviderId,
    pub config: std::collections::HashMap<String, String>,
}

/// 连接响应中的数据部分
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectProviderData {
    pub connected: bool,
    pub available_models: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub provider_info: Option<ProviderInfo>,
}

/// Provider 信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderInfo {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}

/// 连接响应
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectProviderResponse {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<ConnectProviderData>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

impl ConnectProviderResponse {
    /// 创建成功响应
    pub fn success(data: ConnectProviderData) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    /// 创建失败响应
    pub fn error(error: impl Into<String>) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(error.into()),
        }
    }
}
