// apps/desktop/src-tauri/src/core/bot/models/provider/contract/reset.rs
use super::base::{ProviderCommandRequest, ProviderCommandResponse};

/// Request for resetting a provider.
///
/// 重置 Provider 的请求。
pub(crate) type ResetProviderRequest = ProviderCommandRequest;

/// Response for resetting a provider.
///
/// 重置 Provider 的响应。
pub(crate) type ResetProviderResponse = ProviderCommandResponse;
