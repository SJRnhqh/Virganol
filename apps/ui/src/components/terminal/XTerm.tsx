import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "@xterm/xterm/css/xterm.css";

interface XTermProps {
  className?: string;
  nodeId: string;
}

export const XTerm = ({ className, nodeId }: XTermProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  
  // 🔴 关键：增加一个 ref 防止双重初始化
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;

    // 标记为已初始化
    isInitializedRef.current = true;

    // 1. 初始化 xterm
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      convertEol: true, // 解决 Windows 换行问题
      theme: {
        background: "#00000000",
        foreground: "#d0d0d0",
        cursor: "#10b981",
        selectionBackground: "rgba(16, 185, 129, 0.3)",
      },
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    
    term.open(containerRef.current);
    fitAddon.fit();

    // 2. 初始化 Rust PTY
    console.log(`[Terminal] Connecting to backend for node: ${nodeId}`);
    invoke("init_pty", { nodeId }).catch((err) => {
      term.writeln(`\x1b[31mConnection failed: ${err}\x1b[0m`);
    });

    // 3. 监听输出
    const unlistenPromise = listen<string>(`pty-output:${nodeId}`, (event) => {
      term.write(event.payload);
    });

    // 4. 发送输入
    term.onData((data) => {
      invoke("write_pty", { nodeId, data }).catch(console.error);
    });

    terminalRef.current = term;
    fitAddonRef.current = fitAddon;

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      // 清理逻辑
      window.removeEventListener("resize", handleResize);
      term.dispose();
      unlistenPromise.then((unlisten) => unlisten());
      // 重置初始化标记（如果组件真正卸载）
      isInitializedRef.current = false;
    };
  }, [nodeId]);

  useEffect(() => {
    if (!containerRef.current || !fitAddonRef.current) return;
    const observer = new ResizeObserver(() => {
        requestAnimationFrame(() => fitAddonRef.current?.fit());
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
};