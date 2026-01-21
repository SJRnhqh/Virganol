import { useEffect, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
// 引入类型，因为我们需要知道 terminalRef.current 有哪些方法（比如 write, fit）
import { type TerminalRef } from "@/components/base/BaseTerminal";

/**
 * usePtySession Hook
 * 职责：管理与 Rust 后端 PTY 进程的生命周期 (连接 -> 监听 -> 销毁)
 * * @param nodeId 节点 ID，用于区分不同的 Shell 会话
 * @param terminalRef BaseTerminal 的引用，用于将后端数据写入屏幕
 */
export function usePtySession(
  nodeId: string, 
  terminalRef: React.RefObject<TerminalRef | null>
) {
  // 🔒 1. 连接锁：防止 React StrictMode 下的双重初始化
  const isConnectingRef = useRef(false);

  useEffect(() => {
    // 如果没有 ID 或者正在连接中，直接跳过
    if (!nodeId || isConnectingRef.current) return;
    
    // 上锁
    isConnectingRef.current = true;
    
    // 保存 unlisten 函数，用于组件卸载时取消监听
    let unlisten: (() => void) | undefined;

    // 定义异步初始化流程
    const initSession = async () => {
      const term = terminalRef.current;
      
      // 体验优化：在连接前先给用户一点反馈
      term?.write(`\x1b[38;2;100;100;100m[Virganol] Initializing PTY for node: ${nodeId}...\r\n\x1b[0m`);

      try {
        // A. 呼叫后端：启动 PTY
        // 对应 Rust 端: #[tauri::command] fn init_pty(...)
        await invoke("init_pty", { nodeId });

        // B. 建立监听：接收后端发来的日志
        // listen 返回的是一个 Promise，解析结果是一个取消监听的函数
        unlisten = await listen<string>(`pty-output:${nodeId}`, (event) => {
          // 核心逻辑：收到后端数据 -> 写入 xterm
          terminalRef.current?.write(event.payload);
        });

        // 连接成功提示 (绿色)
        term?.write(`\x1b[38;2;16;185;129m[Virganol] Connected.\r\n\x1b[0m`);
        
        // 自动聚焦，让用户可以直接打字
        term?.focus();

      } catch (err) {
        // 错误处理：直接把错误打印在终端上 (红色)
        console.error("PTY Connection Error:", err);
        term?.write(`\x1b[31m[Error] Connection failed: ${err}\r\n\x1b[0m`);
      }
    };

    // 执行初始化
    initSession();

    // 🧹 清理逻辑：组件卸载时执行
    return () => {
      isConnectingRef.current = false;
      
      // 1. 取消前端监听
      if (unlisten) {
        unlisten();
      }
      
      // 2. (可选) 通知后端杀死进程
      // 通常这一步可以省略，如果你在 Rust 端做了 "前端断开连接自动 Kill" 的逻辑
      // invoke("kill_pty", { nodeId }).catch(console.error);
    };
  }, [nodeId, terminalRef]); // 依赖项：只有当 nodeId 变化时才重新运行

  // 📤 暴露给 UI 的能力：发送数据
    const sendInput = useCallback((data: string) => {
      // 直接把用户敲的键透传给 Rust
      invoke("write_pty", { nodeId, data }).catch((err) => {
        console.error("Write Error:", err);
        // 这里用了 terminalRef，所以依赖里必须有它
        terminalRef.current?.write(`\x1b[31m[Error] Write failed: ${err}\r\n\x1b[0m`);
      });
    }, [nodeId, terminalRef]); // 👈 修复：在这里加上 terminalRef
  
    // 返回给组件使用的接口
    return { 
      sendInput 
    };
  }