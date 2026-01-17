import { memo } from "react";
// 修正：给 NodeProps 和 Node 加上 'type' 前缀
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { type ServerConfig } from "../../store/useServerStore";

// 定义该节点接收的数据类型
export type ServerNodeData = Pick<
  ServerConfig,
  "name" | "host" | "status" | "username"
> & {
  avatar?: string;
};

// 必须使用 memo 包裹，以优化 Canvas 拖拽时的性能
const ServerNode = memo(
  ({ data, selected }: NodeProps<Node<ServerNodeData>>) => {
    return (
      <div
        className={`
      relative w-36 h-36 flex flex-col items-center justify-center gap-3
      bg-[#FAF7F0] border-2 rounded-2xl transition-all duration-300 group
      select-none
      ${
        selected
          ? "border-[#84A59D] shadow-xl shadow-[#84A59D]/20 scale-105 z-50"
          : "border-[#E6E1D3] shadow-md hover:border-[#84A59D]/50 hover:-translate-y-1"
      }
    `}
      >
        {/* 1. 连接锚点 (Handles) */}
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle
          type="source"
          position={Position.Bottom}
          className="opacity-0"
        />

        {/* 2. 头像区域 */}
        <div
          className={`
        w-14 h-14 rounded-full flex items-center justify-center text-3xl
        bg-white border border-[#E6E1D3] shadow-inner transition-transform duration-500
        ${data.status === "connected" ? "group-hover:rotate-12 ring-2 ring-emerald-500/20" : "grayscale opacity-80"}
      `}
        >
          {data.avatar || "🌱"}
        </div>

        {/* 3. 信息区域 */}
        <div className="flex flex-col items-center px-2 text-center w-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2F3E46] truncate w-full">
            {data.name}
          </span>
          <span className="text-[9px] font-mono text-[#84A59D] mt-0.5 truncate w-full opacity-80">
            {data.username}@{data.host}
          </span>
        </div>

        {/* 4. 状态指示灯 */}
        <div
          className={`
        absolute top-3 right-3 w-2.5 h-2.5 rounded-full border border-white shadow-sm transition-colors duration-500
        ${
          data.status === "connected"
            ? "bg-emerald-400 animate-pulse"
            : data.status === "connecting"
              ? "bg-amber-400 animate-bounce"
              : "bg-slate-300"
        }
      `}
        />

        {/* 装饰厚度 */}
        <div className="absolute inset-0 rounded-2xl border-b-4 border-r-2 border-[#E6E1D3]/50 pointer-events-none" />
      </div>
    );
  },
);

export default ServerNode;
