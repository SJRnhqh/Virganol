import { useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { TerminalRef } from "@/components/base/BaseTerminal";

interface UsePtySessionProps {
  nodeId: string;
  terminalRef: React.RefObject<TerminalRef | null>;
}

export function usePtySession({ nodeId, terminalRef }: UsePtySessionProps) {
  // 1. 日志 Helper (保持不变)
  const logToTerminal = useCallback(
    (msg: string, type: "info" | "success" | "error" = "info") => {
      if (!terminalRef.current) return;

      let colorStart = "\x1b[38;2;100;100;100m"; // Gray
      if (type === "success") colorStart = "\x1b[38;2;16;185;129m"; // Emerald
      if (type === "error") colorStart = "\x1b[31m"; // Red

      terminalRef.current.write(`${colorStart}${msg}\r\n\x1b[0m`);
    },
    [terminalRef],
  );

  // 2. 发送输入
  const sendInput = useCallback(
    (data: string) => {
      // 🚨 修正点 1：将 { id: nodeId, data } 改为 { nodeId, data }
      // Rust 端应该是: fn write_pty(node_id: String, data: String)
      invoke("write_pty", { nodeId, data }).catch((err) => {
        console.error("Failed to write to PTY:", err);
      });
    },
    [nodeId],
  );

  // 3. 核心生命周期
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let initTimer: ReturnType<typeof setTimeout> | undefined;

    const initSession = async () => {
      if (!terminalRef.current) return;

      logToTerminal(
        `[Virganol] Initializing PTY session for node: ${nodeId}...`,
        "info",
      );

      try {
        // 🚨 修正点 2：将 { id: nodeId } 改为 { nodeId }
        // Rust 端应该是: fn init_pty(node_id: String)
        await invoke("init_pty", { nodeId });

        logToTerminal(`[Virganol] Connected.`, "success");
        terminalRef.current.focus();

        // 监听事件通常不需要改，除非 Rust event name 也变了
        unlisten = await listen<string>(`pty-output:${nodeId}`, (event) => {
          terminalRef.current?.write(event.payload);
        });
      } catch (err) {
        console.error("PTY Init Error:", err);
        logToTerminal(`[Error] Connection failed: ${err}`, "error");
      }
    };

    if (terminalRef.current) {
      initSession();
    } else {
      initTimer = setTimeout(initSession, 10);
    }

    return () => {
      if (initTimer) clearTimeout(initTimer);
      if (unlisten) unlisten();
      // 如果你要取消注释这个，记得也改成 { nodeId }
      // invoke("kill_pty", { nodeId });
    };
  }, [nodeId, logToTerminal, terminalRef]);

  return { sendInput };
}
