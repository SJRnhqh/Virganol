// apps/ui/src/features/bot/components/BotInput.tsx
import { ArrowUp, Paperclip, Sparkles, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENTS } from "../types/agents";
import { AgentSelector } from "./AgentSelector";
import { useBotInput } from "../hooks/useBotInput";

interface BotInputProps {
  hasStarted: boolean;
}

export function BotInput({ hasStarted }: BotInputProps) {
  // 🎣 逻辑全部移交给 Hook
  const {
    value,
    currentAgent,
    setCurrentAgent,
    textareaRef,
    handleSend,
    handleKeyDown,
    handleChange
  } = useBotInput();

  const AgentConfig = AGENTS[currentAgent];

  return (
    <div
      className={cn(
        "relative w-full transition-all duration-500 ease-out",
        hasStarted ? "max-w-4xl mx-auto" : "max-w-3xl",
      )}
    >
      {/* 容器外壳 */}
      <div
        className={cn(
          "flex items-end gap-2 p-3 rounded-3xl border bg-spirit-botinput-box-bg/60 backdrop-blur-xl transition-all duration-300",
          "border-spirit-botinput-box-border/10 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.05)]",
          "focus-within:bg-spirit-botinput-box-bg/80",
          // 聚焦时的光晕色
          currentAgent === "ester"
            ? "focus-within:border-spirit-botinput-ester/30"
            : "focus-within:border-spirit-botinput-kiral/30",
        )}
      >
        {/* === 1. 左侧：智能体切换组件 === */}
        <AgentSelector
          currentAgent={currentAgent}
          onSelect={setCurrentAgent}
          hasStarted={hasStarted}
        />

        {/* === 2. 输入区 === */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={AgentConfig.placeholder}
          className="flex-1 max-h-50 py-2 bg-transparent border-none outline-none text-sm text-main-fg placeholder:text-main-fg/30 resize-none leading-relaxed custom-scrollbar font-medium"
          rows={1}
          style={{ minHeight: "24px" }}
        />

        {/* === 3. 工具区 === */}
        <div className="flex items-center gap-1 pb-0.5 pr-1">
          {/* A. 附件按钮 */}
          <button
            className={cn(
              "p-2 rounded-full transition-all text-main-fg/40 hover:bg-spirit-botinput-icon-bg/5",
              currentAgent === "ester"
                ? "hover:text-spirit-botinput-ester"
                : "hover:text-spirit-botinput-kiral",
            )}
          >
            <Paperclip size={18} strokeWidth={2} />
          </button>

          {/* B. 语音按钮 */}
          <button
            className={cn(
              "p-2 rounded-full transition-all text-main-fg/40 hover:bg-spirit-botinput-icon-bg/5 group relative",
              currentAgent === "ester"
                ? "hover:text-spirit-botinput-ester"
                : "hover:text-spirit-botinput-kiral",
            )}
          >
            <Mic size={18} strokeWidth={2} />
          </button>

          {/* C. 发送按钮 */}
          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className={cn(
              // 布局
              "flex items-center justify-center p-2 rounded-xl transition-all duration-300 transform ml-1",
              // 状态与颜色逻辑
              value.trim()
                ? cn(
                    "shadow-md hover:scale-105 active:scale-95 text-main-bg",
                    currentAgent === "ester"
                      ? "bg-spirit-botinput-ester hover:bg-spirit-botinput-ester/90"
                      : "bg-spirit-botinput-kiral hover:bg-spirit-botinput-kiral/90",
                  )
                : "bg-main-fg/5 text-main-fg/20 cursor-not-allowed",
            )}
          >
            {hasStarted ? (
              <ArrowUp size={18} strokeWidth={2.5} />
            ) : (
              <Sparkles
                size={18}
                className={value.trim() ? "animate-pulse" : ""}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}