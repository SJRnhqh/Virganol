// apps/ui/src/features/bot/components/AgentSelector.tsx
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENTS, type AgentType } from "../config/agents";
import { useAgentSelector } from "../hooks/useAgentSelector";

interface AgentSelectorProps {
  currentAgent: AgentType;
  onSelect: (agentId: AgentType) => void;
  hasStarted: boolean; // 用于决定菜单朝上还是朝下
}

export function AgentSelector({ currentAgent, onSelect, hasStarted }: AgentSelectorProps) {
  // 🎣 使用 Hook 接管状态逻辑
  const { isOpen, containerRef, toggle, handleSelect } = useAgentSelector({ onSelect });

  const AgentConfig = AGENTS[currentAgent];
  const Icon = AgentConfig.icon;

  return (
    <div className="relative pb-1 pl-1" ref={containerRef}>
      
      {/* === 1. 触发按钮 (Trigger) - Soft Capsule 风格 === */}
      <button 
        onClick={toggle}
        className={cn(
          // 基础布局与动效
          "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ease-out cursor-pointer select-none",
          "hover:scale-105 active:scale-95", // ✨ 微交互
          
          // 🟢 边框逻辑
          "border border-spirit-botinput-capsule/30 hover:border-spirit-botinput-capsule/50",
          
          // 🟢 背景逻辑 (Soft Capsule)
          isOpen 
            ? "bg-spirit-botinput-capsule/40 text-main-fg scale-100" 
            : "bg-spirit-botinput-capsule/20 hover:bg-spirit-botinput-capsule/40"
        )}
      >
        <div className="relative">
           <Icon size={16} className={cn("transition-transform duration-300", AgentConfig.color)} />
        </div>
        
        <span className={cn("text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity", AgentConfig.color)}>
          {AgentConfig.name}
        </span>
        
        <ChevronDown 
          size={12} 
          className={cn(
            "transition-transform duration-300 opacity-50", 
            isOpen ? "rotate-180" : "group-hover:translate-y-0.5"
          )} 
        />
      </button>

      {/* === 2. 菜单弹出层 (Dropdown) === */}
      <div 
        className={cn(
          "absolute left-0 w-64 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 z-50 select-none",
          "bg-spirit-botinput-box-bg/80", 
          "border",
          currentAgent === 'ester'
            ? "border-spirit-botinput-ester/30"
            : "border-spirit-botinput-kiral/30",
          
          // 位置优化
          hasStarted 
            ? "bottom-full mb-3 origin-bottom-left" 
            : "top-full mt-3 origin-top-left",
          
          // 进出场动画
          isOpen 
            ? "opacity-100 scale-100 translate-y-0 ease-out-back" 
            : cn("opacity-0 scale-90 pointer-events-none ease-in", hasStarted ? "translate-y-4" : "-translate-y-4")
        )}
      >
        <div className="p-2 flex flex-col gap-1">
          
          <div className="px-3 py-2 text-[10px] font-bold text-main-fg/30 uppercase tracking-widest">
            Select Assistant
          </div>
          
          {Object.values(AGENTS).map((agent) => {
            const isSelected = currentAgent === agent.id;
            
            // 🎨 动态选中背景色
            const activeStyle = isSelected ? {
               backgroundColor: agent.id === 'ester' 
                 ? 'color-mix(in srgb, var(--color-spirit-botinput-ester), transparent 90%)' 
                 : 'color-mix(in srgb, var(--color-spirit-botinput-kiral), transparent 90%)',
            } : {};

            return (
              <button
                key={agent.id}
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleSelect(agent.id); // 使用 Hook 里的处理函数
                }}
                style={activeStyle}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left w-full group",
                  !isSelected && "hover:bg-main-fg/5 hover:scale-[1.02]"
                )}
              >
                {/* 左侧图标容器 */}
                <div className={cn(
                  "p-2 rounded-lg transition-colors duration-300", 
                  isSelected ? "bg-spirit-botinput-box-bg/80 shadow-sm" : "bg-main-fg/5 group-hover:bg-spirit-botinput-box-bg/50",
                  agent.color
                )}>
                  <agent.icon size={18} />
                </div>

                {/* 文字区域 */}
                <div className="flex-1">
                  <div className={cn(
                    "text-sm font-semibold transition-colors", 
                    isSelected ? "text-main-fg" : "text-main-fg/70"
                  )}>
                    {agent.name}
                  </div>
                  <div className="text-[10px] text-main-fg/40 font-medium">
                    {agent.role}
                  </div>
                </div>

                {/* 选中标记 */}
                <div className={cn(
                    "transition-all duration-300 flex items-center justify-center w-6 h-6 rounded-full",
                    isSelected ? "opacity-100 scale-100 bg-spirit-botinput-box-bg/50" : "opacity-0 scale-0"
                )}>
                    {isSelected && <Check size={14} className={cn(agent.color)} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}