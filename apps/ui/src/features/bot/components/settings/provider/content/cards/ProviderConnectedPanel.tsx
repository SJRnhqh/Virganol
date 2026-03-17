// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderConnectedPanel.tsx
// 外部依赖
import { Undo2 } from "lucide-react";

// 内部引用
import type { ProviderConnectedContent } from "@/features/bot/types";
import { useProviderModelActions } from "@/features/bot/hooks";

export const ProviderConnectedPanel = ({
  provider,
  form,
}: ProviderConnectedContent) => {
  const models = useProviderModelActions(provider.id);

  // ── 数据提取与派生状态 ────────────────────────
  // 直接从 form.formData 中提取 apiURL（标准化字段名）
  const connectionUrl = form.formData.apiURL;
  const hasUrl = Boolean(connectionUrl);

  // 模型列表状态计算
  const hasModels = models.available.length > 0;
  const enabledCount = models.available.reduce(
    (count, model) => count + (models.enabled[model] ? 1 : 0),
    0,
  );

  // 全选开关的三态逻辑：off（全不选）/ on（全选）/ mixed（部分选中）
  const selectionState =
    !hasModels || enabledCount === 0
      ? "off"
      : enabledCount === models.available.length
        ? "on"
        : "mixed";

  // ARIA 无障碍属性：mixed 状态需要特殊处理
  const masterAriaChecked =
    selectionState === "mixed" ? "mixed" : selectionState === "on";

  return (
    <div className="pb-2 pl-1 pt-0 space-y-4">
      {/* ── 连接信息区域 ────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        {/* 左侧：连接状态文本（显示 URL 或通用提示） */}
        <div className="text-xs text-settings-panel-fg/70">
          {hasUrl ? (
            <>
              <span className="text-settings-panel-fg/60">Connected to: </span>
              <span className="font-mono text-settings-panel-fg">
                {connectionUrl}
              </span>
            </>
          ) : (
            <span className="text-settings-panel-fg/60">Connection active</span>
          )}
        </div>

        {/* 右侧：Reset 按钮 */}
        {form.onReset && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              form.onReset();
            }}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-settings-panel-fg/50 hover:text-settings-panel-fg/80 hover:bg-settings-panel-fg/5 transition-all duration-200 rounded-md group cursor-pointer"
            title="Reset connection"
          >
            <Undo2 className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span className="text-xs font-medium transition-opacity duration-200 group-hover:opacity-100">
              Reset
            </span>
          </button>
        )}
      </div>

      {/* ── 模型列表区域 ────────────────────────── */}
      <div className="rounded-lg border border-dashed border-settings-panel-fg/30 overflow-hidden">
        {/* 表头：Model 列 + Enabled 列（含全选开关） */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2 text-[10px] uppercase tracking-widest text-settings-panel-fg/50 border-b border-dashed border-settings-panel-fg/20">
          <span>Model</span>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-right">Enabled</span>

            {/* 全选开关：支持三态（on / off / mixed） */}
            <button
              type="button"
              role="checkbox"
              aria-checked={masterAriaChecked}
              disabled={!hasModels}
              data-state={selectionState}
              title="Toggle all models"
              onClick={() =>
                models.onToggleAll(selectionState === "on" ? false : true)
              }
              className={[
                "relative inline-flex h-4 w-9 items-center rounded-full border transition-all",
                "shadow-inner",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "data-[state=on]:bg-settings-panel-check/20 data-[state=on]:border-settings-panel-check/60",
                "data-[state=off]:bg-settings-panel-fg/10 data-[state=off]:border-settings-panel-fg/30",
                "data-[state=mixed]:bg-settings-panel-check/10 data-[state=mixed]:border-settings-panel-check/50",
              ].join(" ")}
            >
              {/* 开关滑块：根据三态调整位置 */}
              <span
                data-state={selectionState}
                className={[
                  "inline-block h-3 w-3 rounded-full transition-transform",
                  "shadow-[inset_0_1px_1px_rgba(0,0,0,0.25)]",
                  "data-[state=on]:translate-x-4 data-[state=on]:bg-settings-panel-check",
                  "data-[state=off]:translate-x-1 data-[state=off]:bg-settings-panel-fg/50",
                  "data-[state=mixed]:translate-x-2 data-[state=mixed]:bg-settings-panel-check/80",
                  "data-[state=mixed]:ring-1 data-[state=mixed]:ring-settings-panel-check/50",
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        {/* 模型列表内容：有模型时渲染列表，无模型时显示空状态 */}
        {hasModels ? (
          <div className="divide-y divide-dashed divide-settings-panel-fg/15">
            {models.available.map((model) => {
              const checked = models.enabled[model];
              return (
                <div
                  key={model}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2 text-xs text-settings-panel-fg/70"
                >
                  {/* 左侧：模型名称 */}
                  <span className="font-mono text-settings-panel-fg/80">
                    {model}
                  </span>

                  {/* 右侧：单个模型的启用开关 */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    onClick={() => models.onToggle(model, !checked)}
                    className={[
                      "relative inline-flex h-4 w-9 items-center rounded-full border transition-all",
                      "shadow-inner",
                      checked
                        ? "bg-settings-panel-check/20 border-settings-panel-check/60"
                        : "bg-settings-panel-fg/10 border-settings-panel-fg/30",
                    ].join(" ")}
                  >
                    {/* 开关滑块 */}
                    <span
                      className={[
                        "inline-block h-3 w-3 rounded-full transition-transform",
                        "shadow-[inset_0_1px_1px_rgba(0,0,0,0.25)]",
                        checked
                          ? "translate-x-4 bg-settings-panel-check"
                          : "translate-x-1 bg-settings-panel-fg/50",
                      ].join(" ")}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          // 空状态：未检测到模型
          <div className="px-3 py-3 text-xs text-settings-panel-fg/45">
            No models detected from this provider yet.
          </div>
        )}
      </div>
    </div>
  );
};
