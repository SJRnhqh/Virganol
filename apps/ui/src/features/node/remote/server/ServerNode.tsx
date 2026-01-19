import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { type ServerConfig } from "@/store/useServerStore";
import { NODE_CONFIG, type NodeCategory } from "@/config/node"; // 引入你定义的节点配置

// 1. 更新数据类型：加入 category 字段
export type ServerNodeData = Pick<
  ServerConfig,
  "name" | "host" | "status" | "username" | "category"
> & {
  avatar?: string;
};

export type ServerNodeType = Node<ServerNodeData, "server">;

const ServerNode = memo(({ data, selected }: NodeProps<ServerNodeType>) => {
  // 从全局配置中获取该类别的图标 (如 Home 或 Server 图标)
  const config = NODE_CONFIG[data.category as NodeCategory];
  const Icon = config?.icon;

  return (
    <div
      className={`
      relative w-36 h-36 flex flex-col items-center justify-center gap-3
      /* 🌟 样式升级：改用语义化变量，背景变白增强对比度 */
      bg-node-bg border-2 rounded-2xl transition-all duration-300 group
      select-none
      ${
        selected
          ? "border-canvas-edge shadow-xl shadow-canvas-edge/20 scale-105 z-50"
          : "border-node-border shadow-md hover:border-canvas-edge/50 hover:-translate-y-1"
      }
    `}
    >
      {/* 1. 连接锚点 */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />

      {/* 2. 图标区域：根据配置动态显示 🏠 或 🖥️ */}
      <div
        className={`
        w-14 h-14 rounded-full flex items-center justify-center text-3xl
        bg-white border border-node-border shadow-inner transition-transform duration-500
        ${data.status === "connected" ? "group-hover:rotate-12 ring-2 ring-emerald-500/20" : "grayscale opacity-80"}
      `}
      >
        {/* 如果配置中有图标则渲染图标，否则回退到 avatar 或默认 🌱 */}
        {Icon ? (
          <Icon size={28} strokeWidth={1.5} className="text-node-fg-desc" />
        ) : (
          data.avatar || "🌱"
        )}
      </div>

      {/* 3. 文本区域：使用语义化文字颜色 */}
      <div className="flex flex-col items-center px-2 text-center w-full">
        <span className="text-[10px] font-black uppercase tracking-widest text-node-fg-title truncate w-full">
          {data.name}
        </span>
        <span className="text-[9px] font-mono text-node-fg-desc mt-0.5 truncate w-full opacity-80">
          {/* 本地节点显示 Local System，远程节点显示连接地址 */}
          {data.category === "home"
            ? "Local System"
            : `${data.username}@${data.host}`}
        </span>
      </div>

      {/* 4. 状态指示灯 (保持逻辑，但边框可随主题) */}
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

      {/* 装饰厚度：边框色也改为变量 */}
      <div className="absolute inset-0 rounded-2xl border-b-4 border-r-2 border-node-border/50 pointer-events-none" />
    </div>
  );
});

ServerNode.displayName = "ServerNode";

export default ServerNode;
