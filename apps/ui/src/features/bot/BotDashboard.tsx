// apps/ui/src/features/bot/BotDashboard.tsx
import { cn } from "@/lib/utils";
import { useBotStore } from "./store/useBotStore";
import { WelcomeBoard } from "./views/WelcomeBoard";
import { ChatStream } from "./views/ChatStream";
import { BotInput } from "./components/BotInput";

export function BotDashboard() {
  // 1. 获取剧本 (Store)
  const { messages, viewMode } = useBotStore();
  
  // 2. 计算当前场景状态
  const hasStarted = messages.length > 0;

  // 3. 编排舞台
  return (
    <div className="w-full h-full flex flex-row overflow-hidden relative">
      
      {/* === 左侧区域 (Solo模式的主舞台 / Split模式的侧边栏) === */}
      <div className={cn(
        "flex flex-col h-full transition-all duration-500 ease-in-out",
        // 核心布局逻辑：如果是 Split 模式，宽度变窄；否则全宽
        viewMode === 'split' ? "w-122.5 border-r border-sidebar-border/50" : "w-full"
      )}>
        
        {/* 内部布局：欢迎页/聊天页切换 */}
        <div className={cn(
          "flex-1 flex flex-col p-4 transition-all duration-500",
          hasStarted ? "justify-end" : "justify-center items-center"
        )}>
          
          {/* 导演指令：如果没开始，显示欢迎页 */}
          {!hasStarted && <WelcomeBoard />}

          {/* 导演指令：如果开始了，显示聊天流 */}
          {hasStarted && <ChatStream />}

          {/* 导演指令：输入框始终在场 */}
          <BotInput hasStarted={hasStarted} />
          
        </div>
      </div>

      {/* === 右侧区域 (工坊区域 - 预留位置) === */}
      {/* 这里展现了极致的可扩展性：现在它是空的，未来只要 viewMode 变成 split，它就会滑出来 */}
      {viewMode === 'split' && (
        <div className="flex-1 bg-white/50 backdrop-blur-sm animate-in slide-in-from-right duration-500">
           {/* 未来这里放 <Workbench /> */}
           <div className="h-full flex items-center justify-center text-sidebar-fg/30">
             Workbench Area
           </div>
        </div>
      )}

    </div>
  );
}