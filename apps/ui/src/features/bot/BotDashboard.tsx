import { useState } from "react";
import { 
  Bot, 
  Settings2, 
  SendHorizontal, 
  Paperclip,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils"; 

export function BotDashboard() {
  const [inputValue, setInputValue] = useState("");

  return (
    // 容器：直接占满剩余空间，无背景色（透明），交给 MainLayout 控制背景
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      
      {/* 1. 顶部 Header (极简，透明) */}
      <header className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-2 opacity-80">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-medium tracking-wide">SciSpirit</span>
        </div>
        
        <button className="text-muted-foreground hover:text-primary transition-colors opacity-50 hover:opacity-100">
          <Settings2 size={18} />
        </button>
      </header>

      {/* 2. 中间内容区 (空状态) */}
      <div className="flex-1 flex flex-col items-center justify-center pointer-events-none select-none opacity-5">
         {/* 一个巨大的背景水印 Logo */}
         <Bot size={120} strokeWidth={0.5} />
      </div>

      {/* 3. 底部输入区 (悬浮感) */}
      <div className="p-6 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-black/20 border border-white/10 rounded-2xl p-2 pl-4 shadow-sm backdrop-blur-sm transition-colors focus-within:bg-black/40 focus-within:border-primary/20">
            
            <button className="p-2 text-muted-foreground hover:text-white transition-colors mb-0.5">
              <Paperclip size={18} />
            </button>

            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask SciSpirit anything..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 resize-none placeholder:text-muted-foreground/30 leading-relaxed custom-scrollbar"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
            
            <button 
              className={cn(
                "p-2.5 rounded-xl transition-all mb-0.5",
                inputValue.trim() 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
                  : "bg-transparent text-muted-foreground opacity-30 cursor-not-allowed"
              )}
              disabled={!inputValue.trim()}
            >
              <SendHorizontal size={18} />
            </button>
          </div>
          
          <div className="text-center mt-3">
             <p className="text-[10px] text-muted-foreground/30 font-light tracking-wider">
               AI-GENERATED CONTENT • CHECK FOR ERRORS
             </p>
          </div>
        </div>
      </div>

    </div>
  );
}