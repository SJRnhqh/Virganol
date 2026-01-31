// TODO：优化样式语义化
import { useState } from "react";
import { BaseExpandableMenu } from "@/components/base/BaseExpandableMenu";
import { DeepSeek as DeepSeekIcon } from "@lobehub/icons";
import {
  DEFAULT_PROVIDER_CONFIG,
  type DeepseekConfig,
} from "@/features/bot/types/llmProviders";

export const DeepseekProvider = () => {
  const [value, setValue] = useState<DeepseekConfig>(
    DEFAULT_PROVIDER_CONFIG.deepseek,
  );
  const [open, setOpen] = useState(false);
  return (
    <BaseExpandableMenu
      open={open}
      onOpenChange={setOpen}
      collapseStrategy="grid"
      className={[
        "w-full transition-all duration-300",
        open
          ? "bg-[#5b4913]/5 shadow-sm"
          : "bg-transparent hover:bg-[#5b4913]/5",
      ].join(" ")}
      headerClassName="w-full flex items-center justify-between px-5 py-4 group outline-none cursor-pointer select-none leading-none"
      chevronClassName={[
        "w-3.5 h-3.5 text-[#5b4913]/40 transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]",
        open ? "rotate-180 text-[#5b4913]/80" : "",
      ].join(" ")}
      contentOuterClassName={[
        "grid transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      ].join(" ")}
      contentInnerClassName="overflow-hidden px-5"
      title={
        <div className="flex items-center gap-3.5">
          <span
            className={[
              "transition-colors duration-200",
              open
                ? "text-[#5b4913]"
                : "text-[#5b4913]/60 group-hover:text-[#5b4913]",
            ].join(" ")}
          >
            <DeepSeekIcon className="w-5 h-5" />
          </span>
          <span
            className={[
              "text-sm font-medium transition-colors",
              open
                ? "text-[#5b4913]"
                : "text-[#5b4913]/60 group-hover:text-[#5b4913]",
            ].join(" ")}
          >
            DeepSeek
          </span>
        </div>
      }
    >
      <div className="w-full border-t border-dashed border-[#5b4913]/10 mb-4" />
      <div className="pb-5 pl-1 space-y-6 pt-1">
        <div className="grid gap-2">
          <label className="text-[10px] uppercase tracking-widest text-[#5b4913]/60 font-bold ml-1 select-none">
            API Key
          </label>
          <input
            type="password"
            value={value.apiKey}
            onChange={(e) => setValue({ ...value, apiKey: e.target.value })}
            placeholder="sk-..."
            className="w-full bg-[#5b4913]/10 text-[#5b4913] border-none rounded-lg px-3.5 py-2.5 text-xs font-mono placeholder:text-[#5b4913]/40 shadow-inner focus:outline-none focus:bg-[#5b4913]/15 focus:ring-1 focus:ring-[#5b4913]/20 transition-all duration-200"
            autoComplete="off"
          />
        </div>
      </div>
    </BaseExpandableMenu>
  );
};
