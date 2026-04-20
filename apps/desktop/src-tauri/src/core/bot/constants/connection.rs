// apps/desktop/src-tauri/src/core/bot/constants/connection.rs

/// 默认健康检查超时时间（秒）
// pub(crate) const DEFAULT_HEALTH_CHECK_TIMEOUT_SECS: u64 = 5;

/// Ollama 健康检查超时时间（秒）- 本地服务，响应快
pub(crate) const OLLAMA_HEALTH_CHECK_TIMEOUT_SECS: u64 = 2;

/// DeepSeek 健康检查超时时间（秒）- 远程 API，可能需要更长时间
pub(crate) const DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS: u64 = 10;
