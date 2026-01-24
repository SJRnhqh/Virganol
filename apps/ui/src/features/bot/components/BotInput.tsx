// apps/ui/src/features/bot/components/BotInput.tsx
import { useState, useRef, useEffect } from "react";
// ✨ 新增 Mic 图标
import { ArrowUp, Paperclip, Sparkles, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBotStore } from "../store/useBotStore";
import { AGENTS, type AgentType } from "../config/agents";
import { AgentSelector } from "./AgentSelector";

interface BotInputProps {
  hasStarted: boolean;
}

export function BotInput({ hasStarted }: BotInputProps) {
  const [value, setValue] = useState("");
  const [currentAgent, setCurrentAgent] = useState<AgentType>('ester'); 
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useBotStore((state) => state.addMessage);

  const AgentConfig = AGENTS[currentAgent];

  // 自动高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSend = () => {
    if (!value.trim()) return;
    addMessage({
      id: Date.now().toString(),
      role: "user",
      content: value,
      timestamp: Date.now(),
    });
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div className={cn("relative w-full transition-all duration-500 ease-out", hasStarted ? "max-w-4xl mx-auto" : "max-w-3xl")}>
      
      {/* 容器外壳 */}
      <div className={cn(
        "flex items-end gap-2 p-3 rounded-3xl border bg-white/60 backdrop-blur-xl transition-all duration-300",
        "border-main-fg/10 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.05)]",
        "focus-within:bg-white/80",
        currentAgent === 'ester' ? "focus-within:border-amber-400/30" : "focus-within:border-[#83a78d]/50"
      )}>
        
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
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
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
               "p-2 rounded-full transition-all text-main-fg/40 hover:bg-black/5", 
               currentAgent === 'ester' ? "hover:text-amber-600" : "hover:text-[#315f4d]"
             )}
             title="Attach files"
          >
            <Paperclip size={18} strokeWidth={2} />
          </button>

          {/* ✨ B. 语音按钮 (新加的) */}
          <button 
             className={cn(
               "p-2 rounded-full transition-all text-main-fg/40 hover:bg-black/5 group relative",
               // 如果是 Kiral，语音按钮 hover 时变绿；如果是 Ester，变琥珀色
               currentAgent === 'ester' ? "hover:text-amber-600" : "hover:text-[#315f4d]"
             )}
             title="Voice Input (Coming Soon)"
          >
            <Mic size={18} strokeWidth={2} />
            
            {/* 🔴 如果当前是 Kiral，可以加一个小红点暗示语音是核心功能 */}
            {currentAgent === 'kiral' && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#8cc269] rounded-full border border-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
            )}
          </button>

          {/* C. 发送按钮 */}
          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className={cn(
              "flex items-center justify-center p-2 rounded-xl transition-all duration-300 transform ml-1", // ml-1 拉开一点距离
              value.trim() 
                ? "bg-[#2b333e] text-[#fbeee2] shadow-md hover:scale-105 active:scale-95" 
                : "bg-main-fg/5 text-main-fg/20 cursor-not-allowed"
            )}
          >
            {hasStarted ? <ArrowUp size={18} strokeWidth={2.5} /> : <Sparkles size={18} className={value.trim() ? "animate-pulse" : ""} />}
          </button>
        </div>

      </div>
    </div>
  );
}