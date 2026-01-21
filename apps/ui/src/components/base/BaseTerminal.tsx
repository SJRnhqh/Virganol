import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Terminal, type ITerminalOptions } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
// 引入 xterm 核心样式（必须）
import "@xterm/xterm/css/xterm.css";

// 🎮 父组件控制器接口
export interface TerminalRef {
  /** 写入数据到终端屏幕 (父组件 -> 终端) */
  write: (data: string | Uint8Array) => void;
  /** 清屏 */
  clear: () => void;
  /** 获取焦点 */
  focus: () => void;
  /** 手动触发布局适配 */
  fit: () => void;
}

// 📦 组件 Props 定义
export interface BaseTerminalProps {
  className?: string;
  /**
   * 🌟 核心交互：当用户在终端敲击键盘时触发
   * 父组件应该在这里接收数据，并决定是发给 WebSocket 还是 Tauri
   */
  onData?: (data: string) => void;
  /**
   * 允许父组件覆盖默认样式
   * 比如远程服务器想用红色背景
   */
  options?: ITerminalOptions;
}

// 🎨 默认主题配置 (Virganol 风格)
const DEFAULT_OPTIONS: ITerminalOptions = {
  cursorBlink: true,
  fontSize: 14,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  convertEol: true, // 自动转换换行符 \n -> \r\n
  allowProposedApi: true,
  theme: {
    background: "#00000000", // 透明背景，适应外部容器颜色
    foreground: "#d0d0d0",   // 默认灰白字
    cursor: "#10b981",       // 标志性绿色光标
    selectionBackground: "rgba(16, 185, 129, 0.3)", // 绿色选区
    // 标准 ANSI 颜色表
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
    // 引用保持
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const isInitializedRef = useRef(false);

    // 🔄 Ref 穿透技巧 1：追踪最新的 onData
    // 解决闭包陷阱：让 xterm 始终能调到最新的 props.onData，而不需要重建
    const onDataRef = useRef(onData);
    useEffect(() => {
      onDataRef.current = onData;
    }, [onData]);

    // 🔄 Ref 穿透技巧 2：只读取初始 options
    // 防止因为 options 对象引用变化导致终端闪烁重建
    const initialOptionsRef = useRef(options);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      write: (data) => terminalRef.current?.write(data),
      clear: () => terminalRef.current?.clear(),
      focus: () => terminalRef.current?.focus(),
      fit: () => fitAddonRef.current?.fit(),
    }));

    // 🚀 初始化逻辑 (只运行一次)
    useEffect(() => {
      if (!containerRef.current || isInitializedRef.current) return;
      isInitializedRef.current = true;

      // 1. 实例化 xterm
      const term = new Terminal({
        ...DEFAULT_OPTIONS,
        ...initialOptionsRef.current, // 合并用户配置
      });

      // 2. 加载插件
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());

      // 3. 挂载到 DOM
      term.open(containerRef.current);
      fitAddon.fit();

      // 4. 绑定输入事件 (调用 Ref 里的最新回调)
      const dataDisposable = term.onData((data) => {
        onDataRef.current?.(data);
      });

      // 保存实例
      terminalRef.current = term;
      fitAddonRef.current = fitAddon;

      // 5. 清理逻辑
      return () => {
        dataDisposable.dispose();
        term.dispose();
        isInitializedRef.current = false;
      };
    }, []); // 依赖为空，确保组件挂载期间 xterm 实例永不销毁

    // 📏 响应式布局监听
    useEffect(() => {
      if (!containerRef.current) return;
      
      const observer = new ResizeObserver(() => {
        // 使用 requestAnimationFrame 避免高频触发报错
        requestAnimationFrame(() => {
          fitAddonRef.current?.fit();
        });
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={containerRef}
        className={`w-full h-full ${className || ""}`}
        // 关键样式：防止 flex 布局下 div 塌陷或无限撑开
        style={{ minHeight: 0, minWidth: 0, overflow: "hidden" }}
      />
    );
  }
);

BaseTerminal.displayName = "BaseTerminal";