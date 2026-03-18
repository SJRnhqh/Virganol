// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderConnectedPanel.tsx
// 外部依赖
import { Link, Zap } from "lucide-react";

// 内部引用
import { cn } from "@/lib";
import type { ProviderConnectedPanelProps } from "@/features/bot/types";
import { useProviderConnectedPanel } from "@/features/bot/hooks";
import { ProviderModelToggleButton } from "./ProviderModelToggleButton";

export const ProviderConnectedPanel = ({
  provider,
  form,
}: ProviderConnectedPanelProps) => {
  const { modelItems, allSelected, onToggleModel, onToggleAllModels } =
    useProviderConnectedPanel(provider.id);

  return (
    <div className="pb-2 pl-1 pt-0">
      {/* ── 模型列表区域 ────────────────────────── */}
      <div
        className={cn(
          // 容器样式
          "rounded-lg border border-dashed overflow-hidden",
          // 边框颜色
          "border-settings-panel-fg/30",
        )}
      >
        {/* 顶部：连接信息 + 全选操作 */}
        <div
          className={cn(
            // 布局
            "flex items-center justify-between gap-3",
            // 间距
            "px-3 py-2",
            // 底部分隔线
            "border-b border-dashed border-settings-panel-fg/20",
            // 背景色（区分于列表区域）
            "bg-settings-panel-fg/5",
          )}
        >
          {/* 左侧：连接信息（图标 + 文本） */}
          <div className="flex items-center gap-2 text-xs text-settings-panel-fg/70">
            {form.formData.apiURL ? (
              <>
                <Link className="w-3.5 h-3.5 text-settings-panel-fg/50" />
                <span className="font-mono text-settings-panel-fg">
                  {form.formData.apiURL}
                </span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-settings-panel-fg/50" />
                <span className="text-settings-panel-fg/60">Active</span>
              </>
            )}
          </div>

          {/* 右侧：全选操作 */}
          <ProviderModelToggleButton
            checked={allSelected}
            role="checkbox"
            onClick={onToggleAllModels}
          />
        </div>

        {/* 模型列表内容 */}
        <div className="divide-y divide-dashed divide-settings-panel-fg/15">
          {modelItems.map(({ name, checked }) => {
            return (
              <div
                key={name}
                className={cn(
                  // 布局
                  "grid grid-cols-[auto_1fr] items-center gap-3",
                  // 间距
                  "px-3 py-2",
                  // 文本样式
                  "text-xs text-settings-panel-fg/70",
                )}
              >
                {/* 左侧：加减符号 */}
                <ProviderModelToggleButton
                  checked={checked}
                  role="switch"
                  onClick={() => onToggleModel(name)}
                />

                {/* 右侧：模型名称 */}
                <span className="font-mono text-settings-panel-fg/80">
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
