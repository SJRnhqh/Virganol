import { NodeCanvas } from "@/components/canvas/NodeCanvas";
import { AddHomeCard } from "@/components/cards/AddHomeCard";
import { AddServerCard } from "@/components/cards/AddServerCard";
import { BaseActionDock } from "@/components/base/BaseActionDock"; // 引入底座

export const NodeDashboard = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-main-bg">
      {/* 1. 核心层：React Flow 画布 */}
      <NodeCanvas />

      {/* 2. 交互层：使用透明 Bar 承载所有快捷卡片 */}
      <BaseActionDock>
        <AddHomeCard />
        {/* 这里可以放一个细细的分割线增加精密感 */}
        <div className="w-px h-8 bg-white/10 mx-1" />
        <AddServerCard />
      </BaseActionDock>
    </div>
  );
};
