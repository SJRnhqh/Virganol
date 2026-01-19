/* apps/ui/src/features/node/home/HomeNode.tsx */
import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Home } from "lucide-react";

// --- 类型定义 ---
export type HomeNodeData = {
  name: string;
  status: "disconnected" | "connected" | "error";
  description?: string;
};

export type HomeNodeType = Node<HomeNodeData, "home">;

// --- 铜质触点组件 (Brass Port) ---
// 平时隐藏，Hover 时像镶嵌的铜片一样浮现
const BrassPort = ({
  position,
  selected,
}: {
  position: Position;
  selected: boolean;
}) => {
  const isVertical = position === Position.Top || position === Position.Bottom;

  // 调整触点位置，让它看起来像是镶嵌在木块侧面的金属片
  const positionClass = {
    [Position.Top]:
      "-top-1.5 left-1/2 -translate-x-1/2 h-3 w-12 flex-col justify-start",
    [Position.Bottom]:
      "-bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-12 flex-col justify-end",
    [Position.Left]:
      "-left-1.5 top-1/2 -translate-y-1/2 w-3 h-12 flex-row justify-start",
    [Position.Right]:
      "-right-1.5 top-1/2 -translate-y-1/2 w-3 h-12 flex-row justify-end",
  };

  return (
    <div
      className={`
        absolute z-0 flex items-center justify-center
        transition-all duration-300 ease-out
        ${positionClass[position]}
        ${selected ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100"}
      `}
    >
      {/* 视觉层：磨砂铜片质感 */}
      <div
        className={`
          relative border border-amber-700/30 shadow-sm
          ${isVertical ? "w-full h-full rounded-sm" : "h-full w-full rounded-sm"}
          /* 金属渐变：模拟铜的光泽 */
          bg-linear-to-br from-amber-200 via-amber-400 to-amber-600
        `}
      >
        {/* 金属拉丝光泽装饰 */}
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
      </div>

      {/* 功能层：实际 Handle */}
      <Handle
        type="source"
        position={position}
        id={position}
        className="absolute! inset-0! w-full! h-full! bg-transparent! border-none! cursor-crosshair"
      />
    </div>
  );
};

export const HomeNode = memo(({ data, selected }: NodeProps<HomeNodeType>) => {
  return (
    <div className="relative group p-4">
      {/* --- 1. 核心木块 (The Wooden Token) --- */}
      <div
        className={`
          relative z-10 flex flex-col items-center justify-center
          w-40 h-40 aspect-square
          /* 形状：稍微圆润的方块，像打磨过的棋子 */
          rounded-xl transition-all duration-300
          /* 边框：深棕色，像烧焦的刻痕 */
          border-2
          ${
            selected
              ? "border-amber-700/80 scale-[1.02] shadow-[0_20px_40px_-10px_rgba(92,61,46,0.4)]"
              : "border-stone-400/50 hover:border-amber-600/50 shadow-[0_4px_10px_-2px_rgba(92,61,46,0.1)] hover:shadow-[0_10px_20px_-5px_rgba(92,61,46,0.2)]"
          }
          /* 材质背景：浅木色/骨色渐变 */
          bg-linear-to-br from-[#F9F3E5] to-[#E6DCC3]
        `}
      >
        {/* --- 纹理层：模拟木纹/纸张噪点 --- */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-multiply pointer-events-none rounded-xl" />
        {/* 如果不想用外部图片，用这个 CSS 模拟微弱的杂色 */}
        <div className="absolute inset-0 opacity-5 bg-repeat bg-[radial-gradient(#8B5E3C_0.5px,transparent_0.5px)] bg-size-[8px_8px] pointer-events-none rounded-xl" />

        {/* --- 内部装饰 --- */}

        {/* 顶部：嵌入式宝石指示灯 (Sealing Wax / Gem) */}
        <div className="absolute top-3 right-3 flex items-center justify-center">
          {/* 宝石底座 */}
          <div className="w-4 h-4 rounded-full bg-amber-800/20 flex items-center justify-center shadow-inner">
            {/* 宝石本体 */}
            <div
              className={`
                    w-2.5 h-2.5 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]
                    ${data.status === "connected" ? "bg-emerald-600 border border-emerald-400" : "bg-red-600 border border-red-400"}
                `}
            />
          </div>
        </div>

        {/* 顶部刻痕装饰 */}
        <div className="absolute top-4 w-12 h-0.5 bg-stone-400/30 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]" />

        {/* 中心图腾：雕刻感图标 */}
        <div
          className={`
            p-4 rounded-xl mb-1 transition-all duration-300
            /* 凹陷效果：内阴影 + 底部高光 */
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.5)]
            ${selected ? "bg-amber-900/5 text-amber-900" : "bg-stone-500/5 text-stone-600"}
        `}
        >
          <Home
            size={36}
            strokeWidth={1.5}
            className="drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]"
          />
        </div>

        {/* 文字铭牌：衬线体，像打印在纸上 */}
        <div className="text-center z-20 mt-1">
          <h3
            className={`
                text-base font-serif font-bold tracking-tight transition-colors
                ${selected ? "text-amber-950" : "text-stone-700"}
            `}
          >
            {data.name}
          </h3>
          <p className="text-[10px] font-serif text-stone-500 uppercase tracking-widest mt-0.5 font-semibold">
            Main Console
          </p>
        </div>
      </div>

      {/* --- 2. 四向铜接口 (镶嵌在底部) --- */}
      {/* 这里的层级 z-0 确保它们看起来是从木块下面伸出来的 */}
      <BrassPort position={Position.Top} selected={selected} />
      <BrassPort position={Position.Bottom} selected={selected} />
      <BrassPort position={Position.Left} selected={selected} />
      <BrassPort position={Position.Right} selected={selected} />
    </div>
  );
});

HomeNode.displayName = "HomeNode";
