use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use std::{
    collections::HashMap,
    io::{Read, Write},
    sync::{Arc, Mutex},
    thread,
};
use tauri::{Emitter, State};

pub struct TerminalState {
    pub sessions: Arc<Mutex<HashMap<String, Box<dyn Write + Send>>>>,
}

impl Default for TerminalState {
    fn default() -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

#[tauri::command]
pub fn init_pty(window: tauri::Window, node_id: String, state: State<'_, TerminalState>) {
    // 1. 强制清理旧会话 (防止重影导致无法连接)
    if state.sessions.lock().unwrap().contains_key(&node_id) {
        state.sessions.lock().unwrap().remove(&node_id);
    }

    println!("[PTY] Starting clean session for: {}", node_id);
    let pty_system = NativePtySystem::default();

    // 2. 最简启动命令 (不做任何骚操作，只求启动)
    let cmd = if cfg!(target_os = "windows") {
        let mut c = CommandBuilder::new("powershell.exe");
        // 只保留最基础的 NoExit，去掉其他花里胡哨的
        c.args(["-NoExit"]); 
        c
    } else {
        let mut c = CommandBuilder::new("bash");
        c.args(["-l"]);
        c
    };

    // 3. ❌ 删除 cmd.cwd() 设置
    // 很多时候是目录权限导致闪退，我们先不设目录，让系统决定

    let pair = match pty_system.openpty(PtySize {
        rows: 24, cols: 80, pixel_width: 0, pixel_height: 0,
    }) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("[PTY Error] OpenPTY failed: {}", e);
            return;
        }
    };

    let child = match pair.slave.spawn_command(cmd) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("[PTY Error] Spawn failed: {}", e);
            return;
        }
    };

    // 4. ❌ 在 Windows 上先不要 drop slave，以防管道过早关闭
    // drop(pair.slave); 
    // 保持引用 (虽然这会导致 slave 句柄泄露，但为了调试 232 错误，先活着再说)
    // 为了不让 rust 报错 unused，我们把 pair 移入线程或者不 drop
    // 这里简单处理：让 pair 在作用域结束时自动 drop，而不是显式 drop

    let mut reader = pair.master.try_clone_reader().expect("Failed to clone reader");
    let writer = pair.master.take_writer().expect("Failed to take writer");

    state.sessions.lock().unwrap().insert(node_id.clone(), writer);

    let node_id_clone = node_id.clone();
    thread::spawn(move || {
        // 保持 child 活着，直到线程结束 (这是一个 dirty hack，但能解决 EOF 问题)
        let _keep_alive = child; 
        // 同样保持 slave 活着
        let _keep_slave = pair.slave;

        let mut buffer = [0u8; 1024];
        loop {
            match reader.read(&mut buffer) {
                Ok(n) if n > 0 => {
                    let output = String::from_utf8_lossy(&buffer[0..n]).to_string();
                    window.emit(&format!("pty-output:{}", node_id_clone), output).unwrap_or(());
                }
                Ok(_) => {
                    println!("[PTY] EOF for {}", node_id_clone);
                    break;
                }
                Err(e) => {
                    eprintln!("[PTY] Read Error: {}", e);
                    break;
                }
            }
        }
    });
}

#[tauri::command]
pub fn write_pty(node_id: String, data: String, state: State<'_, TerminalState>) {
    if let Some(writer) = state.sessions.lock().unwrap().get_mut(&node_id) {
        let _ = write!(writer, "{}", data);
    }
}