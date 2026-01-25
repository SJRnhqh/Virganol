// apps/desktop/src-tauri/src/tmp/terminal.rs
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
    // 🌟 修复 1: 优化锁逻辑。直接 remove 即可，无需先 check 再 remove。
    // 这避免了两次获取锁，且 remove 本身就是幂等的（如果不存在会返回 None，不会报错）。
    {
        let mut sessions = state.sessions.lock().unwrap();
        sessions.remove(&node_id);
    }

    println!("[PTY] Starting clean session for: {}", node_id);
    let pty_system = NativePtySystem::default();

    // 启动命令配置
    let cmd = if cfg!(target_os = "windows") {
        let mut c = CommandBuilder::new("powershell.exe");
        c.args(["-NoExit"]); 
        c
    } else {
        let mut c = CommandBuilder::new("bash");
        c.args(["-l"]);
        c
    };

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

    let mut reader = pair.master.try_clone_reader().expect("Failed to clone reader");
    let writer = pair.master.take_writer().expect("Failed to take writer");

    // 保存 writer
    state.sessions.lock().unwrap().insert(node_id.clone(), writer);

    // 🌟 关键：我们需要把 state 的克隆传进线程，以便线程结束时能清理 session
    let state_clone = state.inner().sessions.clone(); 
    let node_id_clone = node_id.clone();
    
    thread::spawn(move || {
        // 保持 child 活着
        let _keep_alive = child; 
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
        
        // 🌟 修复 2: 自动清理机制
        // 当循环结束（进程退出或出错）时，从全局 Map 中移除该会话，防止内存泄漏
        println!("[PTY] Cleaning up session: {}", node_id_clone);
        let mut sessions = state_clone.lock().unwrap();
        sessions.remove(&node_id_clone);
    });
}

#[tauri::command]
pub fn write_pty(node_id: String, data: String, state: State<'_, TerminalState>) {
    if let Some(writer) = state.sessions.lock().unwrap().get_mut(&node_id) {
        // 🌟 修复 3: 显式 Flush
        // 写入后必须 flush，否则类似 vim/nano 这种交互式程序可能会卡住等缓冲区满
        if let Err(e) = write!(writer, "{}", data).and_then(|_| writer.flush()) {
            eprintln!("[PTY Error] Write/Flush failed for {}: {}", node_id, e);
            // 这里也可以选择如果写入失败就直接移除 session，但通常读线程的 EOF 清理已经足够
        }
    }
}