use tauri::AppHandle;
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;

// 引入生成的 gRPC 模块
pub mod virganol_rpc {
    tonic::include_proto!("virganol");
}

use virganol_rpc::agent_service_client::AgentServiceClient;
use virganol_rpc::PingRequest;

pub fn init(app: &AppHandle) {
    let handle = app.clone();

    tauri::async_runtime::spawn(async move {
        // 1. 启动 Go Sidecar
        let sidecar_command = handle.shell().sidecar("virganol-agent");
        let (mut rx, mut _child) = match sidecar_command {
            Ok(cmd) => cmd.spawn().expect("Failed to spawn sidecar"),
            Err(e) => {
                eprintln!("❌ [Rust] Failed to find sidecar: {}", e);
                return;
            }
        };

        println!("🚀 [Rust] Sidecar process started...");

        // 2. 监听输出
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    let msg = String::from_utf8_lossy(&line).to_string();
                    println!("📤 [Go]: {}", msg.trim());

                    // 3. 【核心握手】解析端口
                    if msg.contains("VIRGANOL_PORT=") {
                        let port_str = msg.trim().split('=').nth(1).unwrap_or("0");
                        let port: u16 = port_str.parse().unwrap_or(0);

                        if port > 0 {
                            let addr = format!("http://127.0.0.1:{}", port);
                            println!("🔗 [Rust] Connecting to gRPC at {} ...", addr);

                            // 4. 发起 gRPC 请求
                            match AgentServiceClient::connect(addr.clone()).await {
                                Ok(mut client) => {
                                    println!("✅ [Rust] gRPC Connected successfully!");

                                    // 发送测试请求
                                    let request = tonic::Request::new(PingRequest {
                                        message: "This is Tauri calling!".into(),
                                    });

                                    match client.ping(request).await {
                                        Ok(response) => {
                                            println!(
                                                "🎉 [Rust] RPC Success! Response: {:?}",
                                                response.into_inner()
                                            );
                                        }
                                        Err(e) => eprintln!("❌ [Rust] RPC Call Failed: {}", e),
                                    }
                                }
                                Err(e) => eprintln!("❌ [Rust] Failed to connect: {}", e),
                            }
                        }
                    }
                }
                // 【优化】Go 的 log.Printf 默认输出到 stderr，我们这里进行区分处理
                CommandEvent::Stderr(line) => {
                    let msg = String::from_utf8_lossy(&line).to_string();
                    let msg_lower = msg.to_lowercase();

                    // 只有当包含 fatal, error, panic 等关键词时才视为真正的错误
                    if msg_lower.contains("fatal")
                        || msg_lower.contains("error")
                        || msg_lower.contains("panic")
                    {
                        eprintln!("⚠️ [Go Error]: {}", msg.trim());
                    } else {
                        // 其他情况视为普通日志
                        println!("📋 [Go Log]: {}", msg.trim());
                    }
                }
                _ => {}
            }
        }
    });
}
