// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/client.rs
use std::sync::OnceLock;

/// Shared HTTP client for provider health check requests.
///
/// 用于所有 Provider 健康检查请求的共享 HTTP 客户端。
static HTTP_CLIENT: OnceLock<reqwest::Client> = OnceLock::new();

/// Gets the shared HTTP client instance.
///
/// 首次调用时初始化，后续调用复用已创建实例和底层连接池。
pub(super) fn get_http_client() -> &'static reqwest::Client {
    HTTP_CLIENT.get_or_init(|| {
        reqwest::Client::builder()
            .pool_max_idle_per_host(10)
            .build()
            .expect("Failed to build HTTP client")
    })
}
