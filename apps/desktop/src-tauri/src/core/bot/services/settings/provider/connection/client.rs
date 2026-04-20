// apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/client.rs
// 外部依赖
use std::sync::OnceLock;

/// 全局共享的 HTTP 客户端，用于所有 provider 的健康检查请求。
///
/// 使用 OnceLock 确保只初始化一次，复用连接池以提升性能。
/// reqwest::Client 内部已实现连接池，多次调用会复用底层 TCP 连接。
static HTTP_CLIENT: OnceLock<reqwest::Client> = OnceLock::new();

/// 获取共享的 HTTP 客户端实例
///
/// 首次调用时初始化，后续调用直接返回已创建的实例。
/// 连接池配置：每个 host 最多保持 10 个空闲连接。
pub(super) fn get_http_client() -> &'static reqwest::Client {
    HTTP_CLIENT.get_or_init(|| {
        reqwest::Client::builder()
            .pool_max_idle_per_host(10)
            .build()
            .expect("Failed to build HTTP client")
    })
}
