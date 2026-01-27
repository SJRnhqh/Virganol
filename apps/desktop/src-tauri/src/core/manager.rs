// apps/desktop/src-tauri/src/core/manager.rs

use std::sync::Arc;
use tauri_plugin_shell::process::CommandChild;
use tokio::sync::Mutex;

use super::rpc::agent_service_client::AgentServiceClient;
use super::rpc::ShutdownRequest;

/// 管理 sidecar 进程的生命周期和 gRPC 连接
pub struct SidecarManager {
    /// 子进程句柄（启动后设置，终止后清空）
    child: Mutex<Option<CommandChild>>,
    /// gRPC 服务地址（握手成功后设置）
    grpc_addr: Mutex<Option<String>>,
}

impl SidecarManager {
    pub fn new() -> Self {
        Self {
            child: Mutex::new(None),
            grpc_addr: Mutex::new(None),
        }
    }

    /// 保存子进程句柄
    pub async fn set_child(&self, child: CommandChild) {
        let mut guard = self.child.lock().await;
        *guard = Some(child);
    }

    /// 保存 gRPC 地址
    pub async fn set_grpc_addr(&self, addr: String) {
        let mut guard = self.grpc_addr.lock().await;
        *guard = Some(addr);
    }

    /// 获取 gRPC 地址
    pub async fn get_grpc_addr(&self) -> Option<String> {
        self.grpc_addr.lock().await.clone()
    }

    /// 优雅关闭 sidecar 进程
    /// 
    /// 流程：
    /// 1. 尝试通过 gRPC 发送 Shutdown 请求（跨平台友好）
    /// 2. 等待进程自行退出
    /// 3. 超时后强制终止进程
    pub async fn shutdown(&self, timeout_ms: u64) -> bool {
        println!("[SidecarManager] Starting shutdown (timeout={}ms)", timeout_ms);

        // 1. 尝试 gRPC 优雅关闭
        if let Some(addr) = self.get_grpc_addr().await {
            println!("[SidecarManager] Sending Shutdown RPC to {}", addr);
            match self.send_shutdown_rpc(&addr, timeout_ms).await {
                Ok(_) => {
                    println!("[SidecarManager] Shutdown RPC acknowledged");
                    // 给进程一点时间自行退出
                    tokio::time::sleep(tokio::time::Duration::from_millis(1000)).await;
                }
                Err(e) => {
                    eprintln!("[SidecarManager] Shutdown RPC failed: {}", e);
                }
            }
        }

        // 2. 检查并强制终止进程（如果还在运行）
        let mut guard = self.child.lock().await;
        if let Some(child) = guard.take() {
            println!("[SidecarManager] Force killing child process");
            if let Err(e) = child.kill() {
                eprintln!("[SidecarManager] Failed to kill process: {}", e);
                return false;
            }
        }

        println!("[SidecarManager] Shutdown complete");
        true
    }

    /// 发送 Shutdown gRPC 请求
    async fn send_shutdown_rpc(
        &self,
        addr: &str,
        timeout_ms: u64,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut client = AgentServiceClient::connect(addr.to_string()).await?;
        let request = tonic::Request::new(ShutdownRequest {
            timeout_ms: timeout_ms as i64,
        });
        client.shutdown(request).await?;
        Ok(())
    }
}

impl Default for SidecarManager {
    fn default() -> Self {
        Self::new()
    }
}

/// Tauri 状态类型别名
pub type SidecarState = Arc<SidecarManager>;
