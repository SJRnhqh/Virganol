// apps/desktop/src-tauri/src/core/mod.rs

pub(crate) mod bot;
pub(crate) mod manager;
pub(crate) mod models;
pub(crate) mod providers;
pub(crate) mod rpc;
pub(crate) mod settings;

use tauri::AppHandle;
use tauri::Manager;
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;

use manager::SidecarState;
use rpc::base_service_client::BaseServiceClient;
use rpc::PingRequest;

/// 初始化并启动 sidecar 进程
pub(crate) fn init(app: &AppHandle) {
    let handle = app.clone();
    // 从 Tauri 状态中获取 SidecarManager
    let manager: SidecarState = app.state::<SidecarState>().inner().clone();

    tauri::async_runtime::spawn(async move {
        // 1. 启动 Go Sidecar
        let sidecar_command = handle.shell().sidecar("virganol-agent");
        let (mut rx, child) = match sidecar_command {
            Ok(cmd) => cmd.spawn().expect("Failed to spawn sidecar"),
            Err(e) => {
                eprintln!("[Rust] Failed to find sidecar: {}", e);
                return;
            }
        };

        // 保存子进程句柄到 manager
        manager.set_child(child).await;
        println!("[Rust] Sidecar process started");

        // 2. 监听输出
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    let msg = String::from_utf8_lossy(&line).to_string();
                    println!("[Go]: {}", msg.trim());

                    // 3. 解析端口握手
                    if msg.contains("VIRGANOL_PORT=") {
                        let port_str = msg.trim().split('=').nth(1).unwrap_or("0");
                        let port: u16 = port_str.parse().unwrap_or(0);

                        if port > 0 {
                            let addr = format!("http://127.0.0.1:{}", port);
                            println!("[Rust] Connecting to gRPC at {} ...", addr);

                            // 保存 gRPC 地址到 manager
                            manager.set_grpc_addr(addr.clone()).await;

                            // 4. 发起 gRPC 连接测试
                            match BaseServiceClient::connect(addr.clone()).await {
                                Ok(mut client) => {
                                    println!("[Rust] gRPC connected successfully");

                                    let request = tonic::Request::new(PingRequest {
                                        message: "Hello from Tauri!".into(),
                                    });

                                    match client.ping(request).await {
                                        Ok(response) => {
                                            println!(
                                                "[Rust] Ping response: {:?}",
                                                response.into_inner()
                                            );
                                        }
                                        Err(e) => eprintln!("[Rust] Ping failed: {}", e),
                                    }
                                }
                                Err(e) => eprintln!("[Rust] gRPC connect failed: {}", e),
                            }
                        }
                    }
                }
                CommandEvent::Stderr(line) => {
                    let msg = String::from_utf8_lossy(&line).to_string();
                    let msg_lower = msg.to_lowercase();

                    if msg_lower.contains("fatal")
                        || msg_lower.contains("error")
                        || msg_lower.contains("panic")
                    {
                        eprintln!("[Go Error]: {}", msg.trim());
                    } else {
                        println!("[Go Log]: {}", msg.trim());
                    }
                }
                CommandEvent::Terminated(status) => {
                    println!("[Rust] Sidecar terminated: {:?}", status);
                    break;
                }
                _ => {}
            }
        }
    });
}
