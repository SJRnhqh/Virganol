// apps/desktop/src-tauri/src/core/bot/constants/connection.rs

// Default health check timeout reserved for a future shared fallback.
//
// 默认健康检查超时时间，保留为后续共享兜底值参考。
// pub(crate) const DEFAULT_HEALTH_CHECK_TIMEOUT_SECS: u64 = 5;

/// Health check timeout for the local Ollama service, in seconds.
///
/// 本地 Ollama 服务的健康检查超时时间（秒）。
pub(crate) const OLLAMA_HEALTH_CHECK_TIMEOUT_SECS: u64 = 2;

/// Health check timeout for the remote DeepSeek API, in seconds.
///
/// 远程 DeepSeek API 的健康检查超时时间（秒）。
pub(crate) const DEEPSEEK_HEALTH_CHECK_TIMEOUT_SECS: u64 = 10;
