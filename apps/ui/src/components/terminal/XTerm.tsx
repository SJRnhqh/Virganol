import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { invoke } from "@tauri-apps/api/core"; // Tauri v2 API
import { listen } from "@tauri-apps/api/event"; // Tauri v2 API
import "@xterm/xterm/css/xterm.css";

interface XTermProps {
  className?: string;
  nodeId: string; // 必须传入 nodeId，用来区分是哪个 Tab
}

export const XTerm = ({ className, nodeId }: XTermProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. 初始化 UI ---
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      convertEol: true, // 关键：解决 Windows/Unix 换行符不一致导致的阶梯状输出
      theme: {
        background: "#00000000", // 透明背景
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

    // --- 2. 初始化 Rust PTY 会话 ---
    console.log(`[Terminal] Initializing PTY for node: ${nodeId}`);
    invoke("init_pty", { nodeId }).catch((err) => {
      term.writeln(`\x1b[31mFailed to connect to backend: ${err}\x1b[0m`);
    });

    // --- 3. 监听后端输出 (Stdout) ---
    const unlistenPromise = listen<string>(`pty-output:${nodeId}`, (event) => {
      term.write(event.payload);
    });

    // --- 4. 发送前端输入 (Stdin) ---
    term.onData((data) => {
      invoke("write_pty", { nodeId, data }).catch(console.error);
    });

    // 保存引用
    terminalRef.current = term;
    fitAddonRef.current = fitAddon;

    // --- 5. 窗口自适应 ---
    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      // 清理工作
      window.removeEventListener("resize", handleResize);
      term.dispose();
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [nodeId]); // 当 nodeId 变化时（比如切 Tab），重新初始化

  // 监听容器大小变化（解决 Flex 布局下的尺寸问题）
  useEffect(() => {
    if (!containerRef.current || !fitAddonRef.current) return;
    const observer = new ResizeObserver(() => {
      // 延时一帧确保布局已更新
      requestAnimationFrame(() => fitAddonRef.current?.fit());
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
};
