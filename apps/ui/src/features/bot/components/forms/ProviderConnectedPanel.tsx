import type { ProviderField } from "@/features/bot/types/llmProviders";
import { Undo2 } from "lucide-react";

interface ProviderConnectedPanelProps {
  fields: ProviderField[];
  value: Record<string, string>;
  models?: string[];
  enabledModels?: Record<string, boolean>;
  onToggleModel?: (model: string, enabled: boolean) => void;
  onToggleAll?: (enabled: boolean) => void;
  onReset?: () => void;
}

export const ProviderConnectedPanel = ({
  fields,
  value,
  models = [],
  enabledModels = {},
  onToggleModel,
  onToggleAll,
  onReset,
}: ProviderConnectedPanelProps) => {
  const urlField = fields.find((field) => field.isUrl);
  const urlValue = urlField ? value[urlField.key] : undefined;
  const hasUrl = Boolean(urlValue);
  const hasModels = models.length > 0;
  const enabledCount = models.reduce(
    (count, model) => count + ((enabledModels[model] ?? true) ? 1 : 0),
    0,
  );
  const selectionState =
    !hasModels || enabledCount === 0
      ? "off"
      : enabledCount === models.length
        ? "on"
        : "mixed";
  const masterAriaChecked =
    selectionState === "mixed" ? "mixed" : selectionState === "on";

  return (
    <div className="pb-2 pl-1 pt-0 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-settings-panel-fg/70">
          {hasUrl ? (
            <>
              <span className="text-settings-panel-fg/60">Connected to: </span>
              <span className="font-mono text-settings-panel-fg">
                {urlValue}
              </span>
            </>
          ) : (
            <span className="text-settings-panel-fg/60">Connection active</span>
          )}
        </div>
        {onReset && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onReset();
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

      <div className="rounded-lg border border-dashed border-settings-panel-fg/30 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2 text-[10px] uppercase tracking-widest text-settings-panel-fg/50 border-b border-dashed border-settings-panel-fg/20">
          <span>Model</span>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-right">Enabled</span>
            <button
              type="button"
              role="checkbox"
              aria-checked={masterAriaChecked}
              disabled={!hasModels}
              data-state={selectionState}
              title="Toggle all models"
              onClick={() =>
                onToggleAll?.(selectionState === "on" ? false : true)
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

        {hasModels ? (
          <div className="divide-y divide-dashed divide-settings-panel-fg/15">
            {models.map((model) => {
              const checked = enabledModels[model] ?? true;
              return (
                <div
                  key={model}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2 text-xs text-settings-panel-fg/70"
                >
                  <span className="font-mono text-settings-panel-fg/80">
                    {model}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    onClick={() => onToggleModel?.(model, !checked)}
                    className={[
                      "relative inline-flex h-4 w-9 items-center rounded-full border transition-all",
                      "shadow-inner",
                      checked
                        ? "bg-settings-panel-check/20 border-settings-panel-check/60"
                        : "bg-settings-panel-fg/10 border-settings-panel-fg/30",
                    ].join(" ")}
                  >
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
          <div className="px-3 py-3 text-xs text-settings-panel-fg/45">
            No models detected from this provider yet.
          </div>
        )}
      </div>
    </div>
  );
};
