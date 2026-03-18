// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderConnectedPanel.tsx
// 外部依赖
import { Link, Zap } from "lucide-react";

// 内部引用
import { cn } from "@/lib";
import type { ProviderConnectedContent } from "@/features/bot/types";
import { useProviderConnectedPanel } from "@/features/bot/hooks";

export const ProviderConnectedPanel = ({
  provider,
  form,
}: ProviderConnectedContent) => {
  const {
    connectionUrl,
    hasUrl,
    hasModels,
    modelItems,
    selectionState,
    masterAriaChecked,
    onToggleModel,
    onToggleAllModels,
  } = useProviderConnectedPanel({
    providerId: provider.id,
    connectionUrl: form.formData.apiURL,
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
            {hasUrl ? (
              <>
                <Link className="w-3.5 h-3.5 text-settings-panel-fg/50" />
                <span className="font-mono text-settings-panel-fg">
                  {connectionUrl}
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
            data-state={selectionState}
            title="Toggle all models"
            onClick={onToggleAllModels}
            className={cn(
              // 布局
              "flex items-center gap-2",
              // 文本样式
              "text-xs text-settings-panel-fg/60",
              // 禁用状态
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            <span className="text-right">Select all</span>
            {/* 全选开关：支持三态（on / off / mixed） */}
            <span
              className={cn(
                // 基础布局
                "relative inline-flex h-4 w-9 items-center rounded-full border transition-all",
                // 视觉效果
                "shadow-inner",
                // 三态样式：on
                "data-[state=on]:bg-settings-panel-check/20 data-[state=on]:border-settings-panel-check/60",
                // 三态样式：off
                "data-[state=off]:bg-settings-panel-fg/10 data-[state=off]:border-settings-panel-fg/30",
                // 三态样式：mixed
                "data-[state=mixed]:bg-settings-panel-check/10 data-[state=mixed]:border-settings-panel-check/50",
              )}
              data-state={selectionState}
            >
              {/* 开关滑块：根据三态调整位置 */}
              <span
                data-state={selectionState}
                className={cn(
                  // 基础样式
                  "inline-block h-3 w-3 rounded-full transition-transform",
                  // 内阴影
                  "shadow-[inset_0_1px_1px_rgba(0,0,0,0.25)]",
                  // 三态位置与颜色：on
                  "data-[state=on]:translate-x-4 data-[state=on]:bg-settings-panel-check",
                  // 三态位置与颜色：off
                  "data-[state=off]:translate-x-1 data-[state=off]:bg-settings-panel-fg/50",
                  // 三态位置与颜色：mixed
                  "data-[state=mixed]:translate-x-2 data-[state=mixed]:bg-settings-panel-check/80",
                  "data-[state=mixed]:ring-1 data-[state=mixed]:ring-settings-panel-check/50",
                )}
              />
            </span>
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
                    "grid grid-cols-[1fr_auto] items-center gap-3",
                    // 间距
                    "px-3 py-2",
                    // 文本样式
                    "text-xs text-settings-panel-fg/70",
                  )}
                >
                  {/* 左侧：模型名称 */}
                  <span className="font-mono text-settings-panel-fg/80">
                    {name}
                  </span>

                  {/* 右侧：单个模型的启用开关 */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    onClick={() => onToggleModel(name)}
                    className={cn(
                      // 基础布局
                      "relative inline-flex h-4 w-9 items-center rounded-full border transition-all",
                      // 视觉效果
                      "shadow-inner",
                      // 开启状态
                      checked &&
                        "bg-settings-panel-check/20 border-settings-panel-check/60",
                      // 关闭状态
                      !checked &&
                        "bg-settings-panel-fg/10 border-settings-panel-fg/30",
                    )}
                  >
                    {/* 开关滑块 */}
                    <span
                      className={cn(
                        // 基础样式
                        "inline-block h-3 w-3 rounded-full transition-transform",
                        // 内阴影
                        "shadow-[inset_0_1px_1px_rgba(0,0,0,0.25)]",
                        // 开启状态
                        checked && "translate-x-4 bg-settings-panel-check",
                        // 关闭状态
                        !checked && "translate-x-1 bg-settings-panel-fg/50",
                      )}
                    />
                  </button>
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
