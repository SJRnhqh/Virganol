// apps/ui/src/features/bot/components/AgentSelector.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENTS, type AgentType } from "../config/agents";

interface AgentSelectorProps {
  currentAgent: AgentType;
  onSelect: (agentId: AgentType) => void;
  hasStarted: boolean; // 用于决定菜单朝上还是朝下
}

export function AgentSelector({ currentAgent, onSelect, hasStarted }: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const AgentConfig = AGENTS[currentAgent];
  const Icon = AgentConfig.icon;

  // 点击外部关闭逻辑
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: AgentType) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="relative pb-1 pl-1" ref={containerRef}>
      
      {/* 1. 触发按钮 (Trigger) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all group cursor-pointer select-none",
          // 背景色 (从配置读取)
          AgentConfig.bgColor,
          // 边框色 (从配置读取，hover时显现)，并给一个极淡的默认边框以增强对比度
          "border-transparent", // 默认
          AgentConfig.borderColor, // Hover 时的颜色
          
          // 激活状态 (Open) 的样式
          isOpen 
            ? "bg-opacity-100 ring-2 ring-offset-1 ring-main-fg/5 border-transparent" 
            : "hover:bg-opacity-100"
        )}
        title="Switch Assistant"
      >
        <div className="relative">
           <Icon size={16} className={cn("transition-transform duration-300", AgentConfig.color)} />
           <span className={cn("absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white", AgentConfig.activeDot)}></span>
        </div>
        
        <span className={cn("text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity", AgentConfig.color)}>
          {AgentConfig.name}
        </span>
        
        <ChevronDown 
          size={12} 
          className={cn(
            "text-main-fg/30 transition-transform duration-300", 
            isOpen ? "rotate-180" : ""
          )} 
        />
      </button>

      {/* 2. 菜单弹出层 (Dropdown/Dropup) */}
      <div 
        className={cn(
          "absolute left-0 w-64 bg-white/80 backdrop-blur-xl border border-main-fg/10 rounded-2xl shadow-xl overflow-hidden transition-all duration-200 z-50 select-none",
          
          // 🚀 核心逻辑：智能方向判断
          hasStarted 
            ? "bottom-full mb-2 origin-bottom-left" // 聊天中：朝上弹 (Dropup)
            : "top-full mt-2 origin-top-left",      // 初始时：朝下弹 (Dropdown)
          
          // 动画状态
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : cn("opacity-0 scale-95 pointer-events-none", hasStarted ? "translate-y-2" : "-translate-y-2")
        )}
      >
        <div className="p-1.5 flex flex-col gap-0.5">
          <div className="px-3 py-2 text-[10px] font-bold text-main-fg/30 uppercase tracking-widest">
            Select Assistant
          </div>
          
          {Object.values(AGENTS).map((agent) => (
            <button
              key={agent.id}
              onClick={(e) => {
                e.stopPropagation(); // 防止冒泡导致意外关闭
                handleSelect(agent.id);
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left w-full group",
                currentAgent === agent.id ? "bg-white shadow-sm" : "hover:bg-main-fg/5"
              )}
            >
              <div className={cn("p-2 rounded-lg bg-main-fg/5 group-hover:bg-white transition-colors", agent.color)}>
                <agent.icon size={18} />
              </div>
              <div className="flex-1">
                <div className={cn("text-sm font-semibold", currentAgent === agent.id ? "text-main-fg" : "text-main-fg/70")}>
                  {agent.name}
                </div>
                <div className="text-[10px] text-main-fg/40 font-medium">
                  {agent.role}
                </div>
              </div>
              {currentAgent === agent.id && <Check size={14} className="text-main-fg/40" />}
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
}