// apps/ui/src/features/bot/views/WelcomeBoard.tsx
import { Bot, FlaskConical, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function WelcomeBoard() {
  return (
    <div className="mb-10 flex flex-col items-center gap-8 select-none animate-in fade-in zoom-in duration-700">
      {/* === 1. 核心视觉区：炼金透镜 === */}
      <div className="relative group cursor-default">
        {/* A. 氛围光晕 */}
        <div className="absolute -inset-6 bg-spirit-welcome-atomsphere blur-[50px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

        {/* B. 主容器：磨砂玻璃 */}
        <div className="relative w-28 h-28 bg-linear-to-br from-spirit-welcome-bot-bg/80 to-spirit-welcome-bot-bg/30 backdrop-blur-md border border-spirit-welcome-bot-border/10 rounded-4xl shadow-[0_8px_30px_-6px_rgba(0,0,0,0.1)] flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
          <Bot
            size={56}
            strokeWidth={1}
            className="text-main-fg drop-shadow-sm"
          />
        </div>

        {/* C. 火花 */}
        <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-spirit-welcome-sparkles-bg/60 backdrop-blur-sm border border-spirit-welcome-sparkles-border/30 rounded-full shadow-sm flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
          <Sparkles
            size={18}
            className={cn(
              "text-spirit-welcome-sparkles-border",
              "fill-spirit-welcome-sparkles-fill",
            )}
          />
        </div>

        {/* D. 锥形瓶 */}
        <div className="absolute -top-3 -right-3 w-12 h-12 bg-spirit-welcome-flaskconical-bg/60 backdrop-blur-sm border border-spirit-welcome-flaskconical-border/30 rounded-2xl shadow-sm flex items-center justify-center transform rotate-12 transition-transform duration-500 group-hover:rotate-20 group-hover:scale-110">
          <FlaskConical
            size={22}
            className="text-spirit-welcome-flaskconical-border fill-spirit-welcome-flaskconical-fill/20"
          />
        </div>
      </div>

      {/* === 2. 文字区 (无色差·纯净版) === */}
      <div className="text-center space-y-5">
        {/* 标题：利用“极细 vs 中黑”做对比，而不依赖颜色 */}
        <h2 className="text-4xl font-thin tracking-tight text-main-fg/90 cursor-default">
          What shall we synthesize today?
        </h2>

        {/* 副标题：保持简约灰度 */}
        <div className="flex items-center justify-center gap-6 text-[10px] font-semibold tracking-[0.35em] text-main-fg/40 uppercase select-none">
          <span className="hover:text-main-fg/80 transition-colors duration-300">
            Experiment
          </span>

          <span className="w-0.5 h-0.5 rounded-full bg-main-fg/20" />

          <span className="hover:text-main-fg/80 transition-colors duration-300">
            Analyze
          </span>

          <span className="w-0.5 h-0.5 rounded-full bg-main-fg/20" />

          <span className="hover:text-main-fg/80 transition-colors duration-300">
            Discover
          </span>
        </div>
      </div>
    </div>
  );
}
