// apps/desktop/src-tauri/src/core/sidecar.rs
use tauri::AppHandle;
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;

pub fn init(app: &AppHandle) {
    // Clone handle for the async task
    let handle = app.clone();

    tauri::async_runtime::spawn(async move {
        // "virganol-agent" must match the name configured in tauri.conf.json
        let agent_command = handle.shell().sidecar("virganol-agent");

        let (mut rx, mut _child) = match agent_command {
            Ok(cmd) => match cmd.spawn() {
                Ok(child) => child,
                Err(e) => {
                    eprintln!("❌ [Go Agent] Failed to start process: {}", e);
                    return;
                }
            },
            Err(e) => {
                eprintln!("❌ [Go Agent] Failed to create command: {}", e);
                return;
            }
        };

        println!("🚀 [Go Agent] started (managed by core)");

        // Listen to the Go process output
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    let msg = String::from_utf8_lossy(&line);
                    println!("📤 [Go Agent:stdout] {}", msg.trim_end());
                    // TODO: parse a "PORT=xxxx" or JSON line and emit an event to the UI:
                    // handle.emit_all("agent-ready", port).ok();
                }
                CommandEvent::Stderr(line) => {
                    let msg = String::from_utf8_lossy(&line);
                    eprintln!("⚠️ [Go Agent:stderr] {}", msg.trim_end());
                }
                CommandEvent::Terminated(status) => {
                    println!("🛑 [Go Agent] terminated: {:?}", status);
                }
                _ => {}
            }
        }
    });
}
