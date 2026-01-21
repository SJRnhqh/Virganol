// src/components/base/BaseTerminal.tsx
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Terminal, type ITerminalOptions } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

// 暴露给父组件的方法
export interface TerminalRef {
  write: (data: string | Uint8Array) => void;
  clear: () => void;
  focus: () => void;
  fit: () => void;
}

export interface BaseTerminalProps {
  className?: string;
  onData?: (data: string) => void;
  options?: ITerminalOptions;
}

// 默认通用主题
const DEFAULT_OPTIONS: ITerminalOptions = {
  cursorBlink: true,
  fontSize: 14,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  convertEol: true,
  allowProposedApi: true,
  theme: {
    background: "#00000000",
    foreground: "#d0d0d0",
    cursor: "#10b981",
    selectionBackground: "rgba(16, 185, 129, 0.3)",
    black: "#2e3440",
    red: "#bf616a",
    green: "#a3be8c",
    yellow: "#ebcb8b",
    blue: "#81a1c1",
    magenta: "#b48ead",
    cyan: "#88c0d0",
    white: "#e5e9f0",
  },
};

export const BaseTerminal = forwardRef<TerminalRef, BaseTerminalProps>(
  ({ className, onData, options }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    // 防止 React 严格模式下的双重初始化
    const isInitializedRef = useRef(false);

    // 🟢 核心修改 1：使用 Ref 追踪最新的 onData
    // 这样 xterm 初始化时绑定一次 ref.current 即可，不需要因为函数变化而重建
    const onDataRef = useRef(onData);
    useEffect(() => {
      onDataRef.current = onData;
    }, [onData]);

    // 🟢 核心修改 2：只记录初始的 options
    // 我们不希望 options 对象引用变化导致终端重建
    const initialOptionsRef = useRef(options);

    useImperativeHandle(ref, () => ({
      write: (data) => terminalRef.current?.write(data),
      clear: () => terminalRef.current?.clear(),
      focus: () => terminalRef.current?.focus(),
      fit: () => fitAddonRef.current?.fit(),
    }));

    // 初始化 xterm
    useEffect(() => {
      if (!containerRef.current || isInitializedRef.current) return;
      isInitializedRef.current = true;

      const term = new Terminal({
        ...DEFAULT_OPTIONS,
        ...initialOptionsRef.current, // 👈 只使用初始化时的配置
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());

      term.open(containerRef.current);
      fitAddon.fit();

      // 🟢 核心修改 3：绑定事件时调用 ref.current
      // 无论外部传入的 onData 怎么变，这里始终能调到最新的函数
      const dataDisposable = term.onData((data) => {
        onDataRef.current?.(data);
      });

      terminalRef.current = term;
      fitAddonRef.current = fitAddon;

      return () => {
        dataDisposable.dispose();
        term.dispose();
        isInitializedRef.current = false;
      };
      // 🟢 核心修改 4：显式忽略依赖检查
      // 我们确实只希望它在挂载时运行一次，不希望被 props 变化打断
    }, []);

    // 响应式布局
    useEffect(() => {
      if (!containerRef.current) return;
      const observer = new ResizeObserver(() => {
        requestAnimationFrame(() => fitAddonRef.current?.fit());
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={containerRef}
        className={`w-full h-full ${className || ""}`}
        style={{ minHeight: 0, minWidth: 0, overflow: "hidden" }}
      />
    );
  },
);

BaseTerminal.displayName = "BaseTerminal";
