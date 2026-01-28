// apps/desktop/src-tauri/src/core/manager.rs

use std::sync::Arc;
use tauri_plugin_shell::process::CommandChild;
use tokio::sync::Mutex;

#[cfg(target_os = "windows")]
use std::process::Command;

use super::rpc::base_service_client::BaseServiceClient;
use super::rpc::ShutdownRequest;

/// 内部状态结构体，包含子进程和gRPC地址
struct SidecarStateInner {
    /// 子进程句柄（启动后设置，终止后清空）
    child: Option<CommandChild>,
    /// 子进程 PID（用于 Windows 上的强制清理）
    pid: Option<u32>,
    /// gRPC 服务地址（握手成功后设置）
    grpc_addr: Option<String>,
}

/// 管理 sidecar 进程的生命周期和 gRPC 连接
pub struct SidecarManager {
    /// 统一的内部状态，用单一互斥锁保护
    state: Mutex<SidecarStateInner>,
}

impl SidecarManager {
    pub fn new() -> Self {
        Self {
            state: Mutex::new(SidecarStateInner {
                child: None,
                pid: None,
                grpc_addr: None,
            }),
        }
    }

    /// 保存子进程句柄
    pub async fn set_child(&self, child: CommandChild) {
        let mut state = self.state.lock().await;
        state.pid = Some(child.pid());
        state.child = Some(child);
    }

    /// 保存 gRPC 地址
    pub async fn set_grpc_addr(&self, addr: String) {
        let mut state = self.state.lock().await;
        state.grpc_addr = Some(addr);
    }

    /// 获取 gRPC 地址
    pub async fn get_grpc_addr(&self) -> Option<String> {
        let state = self.state.lock().await;
        state.grpc_addr.clone()
    }

    /// 优雅关闭 sidecar 进程
    ///
    /// 流程：
    /// 1. 尝试通过 gRPC 发送 Shutdown 请求（跨平台友好）
    /// 2. 短暂等待进程自行退出
    /// 3. 强制终止进程（Windows 上使用 taskkill /T 终止进程树）
    pub async fn shutdown(&self, timeout_ms: u64) -> bool {
        println!(
            "[SidecarManager] Starting shutdown (timeout={}ms)",
            timeout_ms
        );

        // 1. 尝试 gRPC 优雅关闭
        if let Some(addr) = self.get_grpc_addr().await {
            println!("[SidecarManager] Sending Shutdown RPC to {}", addr);
            match self.send_shutdown_rpc(&addr, timeout_ms).await {
                Ok(_) => {
                    println!("[SidecarManager] Shutdown RPC acknowledged");
                    // 给进程一点时间自行退出
                    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
                }
                Err(e) => {
                    eprintln!("[SidecarManager] Shutdown RPC failed: {}", e);
                }
            }
        }

        // 2. 强制终止进程
        let mut state = self.state.lock().await;
        let pid = state.pid.take();

        // Windows: 使用 taskkill /T 终止整个进程树
        #[cfg(target_os = "windows")]
        if let Some(pid) = pid {
            println!("[SidecarManager] Killing process tree (PID: {})", pid);
            let result = Command::new("taskkill")
                .args(["/F", "/T", "/PID", &pid.to_string()])
                .output();

            match result {
                Ok(output) => {
                    if output.status.success() {
                        println!("[SidecarManager] Process tree killed successfully");
                    } else {
                        // 进程可能已经通过 gRPC 优雅退出，这是正常的
                        println!(
                            "[SidecarManager] Process already exited (graceful shutdown worked)"
                        );
                    }
                }
                Err(e) => {
                    eprintln!("[SidecarManager] Failed to run taskkill: {}", e);
                }
            }
            // 清理 child handle（即使 taskkill 已处理）
            state.child.take();
        }

        // 非 Windows: 使用标准 kill
        #[cfg(not(target_os = "windows"))]
        {
            let _ = pid; // 消除未使用警告
            if let Some(child) = state.child.take() {
                println!("[SidecarManager] Force killing child process");
                if let Err(e) = child.kill() {
                    eprintln!("[SidecarManager] Failed to kill process: {}", e);
                    return false;
                }
            }
        }

        state.grpc_addr = None;
        println!("[SidecarManager] Shutdown complete");
        true
    }

    /// 发送 Shutdown gRPC 请求
    async fn send_shutdown_rpc(
        &self,
        addr: &str,
        timeout_ms: u64,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut client = BaseServiceClient::connect(addr.to_string()).await?;
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
