// apps/ui/src/features/bot/components/forms/ProviderFormFields.tsx
// TODO: 后续有空对该组件进行重构优化
// 外部依赖
import { AlertCircle } from "lucide-react";

// 内部引用
import type { ProviderField } from "@/features/bot/types";
import {
  PROVIDER_CARD_STATES,
  type ProviderCardState,
} from "@/features/bot/constants";

interface ProviderFormFieldsProps {
  cardState: ProviderCardState;
  fields: ProviderField[];
  value: Record<string, string>;
  onChange: (key: string, val: string) => void;
  errorMessage?: string | null;
}

export const ProviderFormFields = ({
  cardState,
  fields,
  value,
  onChange,
  errorMessage,
}: ProviderFormFieldsProps) => {
  // unset 状态：纯净表单
  if (cardState === PROVIDER_CARD_STATES.UNSET) {
    return (
      <div className="pb-2 pl-1 space-y-2 pt-0">
        {fields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <label className="text-[10px] uppercase tracking-widest text-settings-panel-fg/60 font-bold ml-1 select-none">
              {field.label}
              {field.optional && (
                <span className="text-settings-panel-fg/40 font-normal normal-case tracking-normal ml-1">
                  (Optional)
                </span>
              )}
            </label>
            <input
              type={field.type}
              value={value[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-settings-panel-fg/10 text-settings-panel-fg border-none rounded-lg px-3.5 py-2.5 text-xs font-mono placeholder:text-settings-panel-fg/40 shadow-inner focus:outline-none focus:bg-settings-panel-fg/15 focus:ring-1 focus:ring-settings-panel-fg/20 transition-all duration-200"
              autoComplete={field.type === "password" ? "off" : undefined}
              spellCheck={field.type === "text" ? false : undefined}
            />
          </div>
        ))}
      </div>
    );
  }

  // pending 状态：表单保持结构，Input 添加脉冲动画
  if (cardState === PROVIDER_CARD_STATES.PENDING) {
    return (
      <div className="pb-2 pl-1 space-y-2 pt-0">
        {fields.map((field) => (
          <div key={field.key} className="grid gap-2">
            {/* Label 保持静态 */}
            <label className="text-[10px] uppercase tracking-widest text-settings-panel-fg/40 font-bold ml-1 select-none">
              {field.label}
              {field.optional && (
                <span className="text-settings-panel-fg/30 font-normal normal-case tracking-normal ml-1">
                  (Optional)
                </span>
              )}
            </label>

            {/* Input 添加脉冲动画 */}
            <input
              type={field.type}
              value={value[field.key] ?? ""}
              disabled
              placeholder={field.placeholder}
              className="w-full bg-settings-panel-fg/10 text-settings-panel-fg/40 border-none rounded-lg px-3.5 py-2.5 text-xs font-mono cursor-not-allowed animate-pulse"
            />
          </div>
        ))}
      </div>
    );
  }

  // failed 状态：错误信息 + 表单
  if (cardState === PROVIDER_CARD_STATES.FAILED) {
    return (
      <div className="space-y-3">
        {/* 错误信息 */}
        {errorMessage && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300/90 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        )}

        {/* 表单字段 */}
        <div className="pb-2 pl-1 space-y-2 pt-0">
          {fields.map((field) => (
            <div key={field.key} className="grid gap-2">
              <label className="text-[10px] uppercase tracking-widest text-settings-panel-fg/60 font-bold ml-1 select-none">
                {field.label}
                {field.optional && (
                  <span className="text-settings-panel-fg/40 font-normal normal-case tracking-normal ml-1">
                    (Optional)
                  </span>
                )}
              </label>
              <input
                type={field.type}
                value={value[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-settings-panel-fg/10 text-settings-panel-fg border-none rounded-lg px-3.5 py-2.5 text-xs font-mono placeholder:text-settings-panel-fg/40 shadow-inner focus:outline-none focus:bg-settings-panel-fg/15 focus:ring-1 focus:ring-settings-panel-fg/20 transition-all duration-200"
                autoComplete={field.type === "password" ? "off" : undefined}
                spellCheck={field.type === "text" ? false : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 兜底：理论上不应该到这里
  return null;
};
