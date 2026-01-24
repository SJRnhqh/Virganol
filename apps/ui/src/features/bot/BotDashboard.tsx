import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SendHorizontal, 
  Paperclip, 
  ArrowUp
} from "lucide-react";
import { cn } from "@/lib/utils"; 

export function BotDashboard() {
  const [inputValue, setInputValue] = useState("");
  // 核心状态：是否开始对话。默认为 false，输入框在中间。
  const [hasStarted, setHasStarted] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setHasStarted(true); // 🚀 触发布局切换：中心 -> 底部
    // 这里未来接真实的发送逻辑
    console.log("Sending:", inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // 外层容器
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-main-bg/50">
      {/* 2. 主体区域：利用 Flex 布局控制垂直位置 */}
      {/* hasStarted = false: justify-center (居中) */}
      {/* hasStarted = true:  justify-end (到底部) */}
      <div className={cn(
        "flex-1 flex flex-col relative transition-all duration-500 ease-in-out",
        hasStarted ? "justify-end" : "justify-center items-center"
      )}>
        {/* B. 聊天记录区域 (只在开始后显示并占据剩余空间) */}
        {hasStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 w-full overflow-y-auto p-4 custom-scrollbar"
          >
             {/* 这里未来放置 ChatMessageList */}
             <div className="h-full flex flex-col justify-end items-center pb-10 opacity-30 text-sm text-muted-foreground">
                <p>Chat history starts here...</p>
             </div>
          </motion.div>
        )}

        {/* 3. 输入框区域 (神奇的布局切换) */}
        {/* - layout prop: 让 framer-motion 自动处理位置变化的平滑过渡
            - key: 保持不变，确保 React 认为是同一个组件在移动
        */}
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "w-full z-20", 
            // 如果未开始，限制宽度并居中；如果已开始，全宽并带 Padding
            hasStarted ? "p-4 max-w-4xl mx-auto" : "max-w-2xl px-6"
          )}
        >
          <div className={cn(
            "relative flex items-end gap-2 p-2 pl-4 border shadow-sm backdrop-blur-md transition-all duration-300",
            // 样式微调：未开始时圆角大一点(像搜索框)，开始后圆角标准一点
            hasStarted 
              ? "rounded-xl bg-sidebar-bg/80 border-sidebar-border" 
              : "rounded-2xl bg-white/60 border-white/40 shadow-xl"
          )}>
            
            {/* 附件按钮 */}
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors mb-0.5 rounded-lg hover:bg-black/5">
              <Paperclip size={18} />
            </button>

            {/* 输入域 */}
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasStarted ? "Message SciSpirit..." : "Ask SciSpirit anything..."}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 resize-none placeholder:text-muted-foreground/40 leading-relaxed custom-scrollbar text-sidebar-fg"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "150px" }}
            />
            
            {/* 发送按钮 */}
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={cn(
                "p-2.5 rounded-xl transition-all mb-0.5",
                inputValue.trim() 
                  ? "bg-primary text-primary-foreground shadow-md hover:scale-105 active:scale-95" 
                  : "bg-transparent text-muted-foreground/30 cursor-not-allowed"
              )}
            >
              {hasStarted ? <ArrowUp size={18} /> : <SendHorizontal size={18} />}
            </button>
          </div>

          {/* 底部免责声明 (仅在初始状态显示，避免聊天时干扰) */}
          <AnimatePresence>
            {!hasStarted && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center mt-4"
              >
                 <p className="text-[10px] text-muted-foreground/40 font-light tracking-widest uppercase">
                   AI-Generated Content • Check for errors
                 </p>
              </motion.div>
            )}
          </AnimatePresence>
          
        </motion.div>

      </div>
    </div>
  );
}