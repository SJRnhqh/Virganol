// apps/desktop/src-tauri/src/core/bot/constants/connection.rs

/// Health check timeout for the local Ollama service, in seconds.
///
/// 本地 Ollama 服务的健康检查超时时间（秒）。
pub(in crate::core::bot) const OLLAMA_HEALTH_CHECK_TIMEOUT_SECS: u64 = 2;

/// Health check timeout for the remote DeepSeek API, in seconds.
///
/// 远程 DeepSeek API 的健康检查超时时间（秒）。
pub(in crate::core::bot) const DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS: u64 = 10;
