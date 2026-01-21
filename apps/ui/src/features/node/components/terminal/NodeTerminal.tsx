import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { BaseTerminal, type TerminalRef } from "@/components/base/BaseTerminal";

interface NodeTerminalProps {
  /** * 节点的唯一 ID
   * 业务组件根据这个 ID 决定连接哪个 Shell (本地或远程)
   */
  nodeId: string;
  className?: string;
}

export const NodeTerminal = ({ nodeId, className }: NodeTerminalProps) => {
  // 1. 获取 BaseTerminal 的控制权 (遥控器)
  const terminalRef = useRef<TerminalRef>(null);
  
  // 防止重复连接的守卫 (React StrictMode 兼容)
  const isConnectingRef = useRef(false);

  useEffect(() => {
    // 简单的防抖/锁，防止快速重渲染导致的重复初始化
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    let unlisten: (() => void) | undefined;

    // 2. 初始化后端 PTY 会话
    const initSession = async () => {
      // 先写一行提示，提升体验
      terminalRef.current?.write(`\x1b[38;2;100;100;100m[Virganol] Initializing PTY for node: ${nodeId}...\r\n\x1b[0m`);

      try {
        // A. 建立连接
        // 这里的后端命令 "init_pty" 需要你在 Rust 端实现
        await invoke("init_pty", { nodeId });

        // B. 监听后端输出 (Stdout)
        // 注意：Tauri 的 listen 返回的是一个 Promise，解析出 unlisten 函数
        unlisten = await listen<string>(`pty-output:${nodeId}`, (event) => {
          // 核心：收到后端数据 -> 写入 UI
          terminalRef.current?.write(event.payload);
        });
        
        // 成功提示
        terminalRef.current?.write(`\x1b[38;2;16;185;129m[Virganol] Connected.\r\n\x1b[0m`);
        // 自动聚焦输入框
        terminalRef.current?.focus();

      } catch (err) {
        // 错误处理：直接显示在终端里，让用户知道发生了什么
        terminalRef.current?.write(`\x1b[31m[Error] Connection failed: ${err}\r\n\x1b[0m`);
        console.error("PTY Init Error:", err);
      }
    };

    initSession();

    // 3. 清理逻辑
    return () => {
      // 标记为非连接状态
      isConnectingRef.current = false;
      
      // 取消监听 Tauri 事件
      if (unlisten) {
        unlisten();
      }
      
      // 现在的设计通常不主动在前端 kill pty，而是让后端检测到 listener 断开自动清理
      // 或者你可以显式调用: invoke("kill_pty", { nodeId })
    };
  }, [nodeId]); // 仅当 nodeId 变化时重新连接

  // 4. 处理用户输入
  const handleUserInput = (data: string) => {
    // 直接透传给后端
    invoke("write_pty", { nodeId, data }).catch((err) => {
      console.error("Write Error:", err);
      terminalRef.current?.write(`\x1b[31m[Error] Write failed: ${err}\r\n\x1b[0m`);
    });
  };

  return (
    <BaseTerminal
      ref={terminalRef}
      className={className}
      onData={handleUserInput}
      // 如果是远程节点，你可以通过 options 传入不同的主题色
      // options={{ theme: { background: "#1a1b26" } }}
    />
  );
};