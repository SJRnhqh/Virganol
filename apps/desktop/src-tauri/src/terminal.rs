use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use std::{
    collections::HashMap,
    io::{Read, Write},
    sync::{Arc, Mutex},
    thread,
};
use tauri::{Emitter, State};

// 定义专门管理终端会话的状态结构体
// 使用 pub 确保 lib.rs 可以访问它来初始化
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
    // 1. 防止重复创建
    if state.sessions.lock().unwrap().contains_key(&node_id) {
        return; // 已经存在，直接返回
    }

    println!("Initializing PTY for node: {}", node_id);

    // 2. 创建 PTY 系统
    let pty_system = NativePtySystem::default();

    // 3. 确定 Shell (Windows -> PowerShell, Mac/Linux -> Zsh/Bash)
    let shell = if cfg!(target_os = "windows") {
        "powershell.exe"
    } else {
        "zsh"
    };

    let mut cmd = CommandBuilder::new(shell);
    // 设置工作目录为用户主目录，避免直接在项目目录里
    if let Some(dirs) = directories::UserDirs::new() {
        cmd.cwd(dirs.home_dir());
    }

    // 4. 启动进程
    let pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .expect("Failed to create PTY");

    let _child = pair
        .slave
        .spawn_command(cmd)
        .expect("Failed to spawn shell");

    // 5. 获取读写流
    let mut reader = pair
        .master
        .try_clone_reader()
        .expect("Failed to clone reader");
    let writer = pair.master.take_writer().expect("Failed to take writer");

    // 6. 保存写入流 (用于前端发送指令过来)
    state
        .sessions
        .lock()
        .unwrap()
        .insert(node_id.clone(), writer);

    // 7. 开启线程读取输出 (Stdout -> 前端)
    let node_id_clone = node_id.clone();
    thread::spawn(move || {
        let mut buffer = [0u8; 1024];
        loop {
            match reader.read(&mut buffer) {
                Ok(n) if n > 0 => {
                    let output = String::from_utf8_lossy(&buffer[0..n]).to_string();
                    // 发送事件: pty-output:<node_id>
                    window
                        .emit(&format!("pty-output:{}", node_id_clone), output)
                        .unwrap_or(());
                }
                Ok(_) => break,  // EOF
                Err(_) => break, // Error
            }
        }
        println!("PTY reader thread exited for node: {}", node_id_clone);
    });
}

#[tauri::command]
pub fn write_pty(node_id: String, data: String, state: State<'_, TerminalState>) {
    // 获取对应的 Writer 并写入数据
    if let Some(writer) = state.sessions.lock().unwrap().get_mut(&node_id) {
        if let Err(e) = write!(writer, "{}", data) {
            eprintln!("Failed to write to PTY: {}", e);
        }
    }
}
