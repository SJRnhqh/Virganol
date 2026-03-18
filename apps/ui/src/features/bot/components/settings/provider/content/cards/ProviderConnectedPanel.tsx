// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderConnectedPanel.tsx
// 外部依赖
import { Link, Zap, Plus, Minus } from "lucide-react";

// 内部引用
import { cn } from "@/lib";
import type { ProviderConnectedContent } from "@/features/bot/types";
import { useProviderConnectedPanel } from "@/features/bot/hooks";

export const ProviderConnectedPanel = ({
  provider,
  form,
}: ProviderConnectedContent) => {
  const {
    hasModels,
    modelItems,
    selectionState,
    masterAriaChecked,
    onToggleModel,
    onToggleAllModels,
  } = useProviderConnectedPanel({
    providerId: provider.id,
  });

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
          <button
            type="button"
            role="checkbox"
            aria-checked={masterAriaChecked}
            disabled={!hasModels}
            title="Toggle all models"
            onClick={onToggleAllModels}
            className={cn(
              // 基础布局
              "inline-flex items-center justify-center",
              "w-5 h-5",
              // 文本样式
              "text-settings-panel-fg/60",
              // 光标
              "cursor-pointer",
              // 禁用状态
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            {/* 全选符号：未全选显示 +，全选显示 - */}
            {selectionState === "on" ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* 模型列表内容：有模型时渲染列表，无模型时显示空状态 */}
        {hasModels ? (
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
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    onClick={() => onToggleModel(name)}
                    className={cn(
                      // 基础布局
                      "inline-flex items-center justify-center",
                      "w-5 h-5",
                      // 文本样式
                      "text-settings-panel-fg/60",
                      // 光标
                      "cursor-pointer",
                    )}
                  >
                    {/* 未启用显示加号，已启用显示减号 */}
                    {checked ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>

                  {/* 右侧：模型名称 */}
                  <span className="font-mono text-settings-panel-fg/80">
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          // 空状态：未检测到模型
          <div
            className={cn(
              // 间距
              "px-3 py-3",
              // 文本样式
              "text-xs text-settings-panel-fg/45",
            )}
          >
            No models detected from this provider yet.
          </div>
        )}
      </div>
    </div>
  );
};
