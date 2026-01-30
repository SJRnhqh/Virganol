import { useState } from "react";
import { ExpandableMenuSection } from "./ExpandableMenuSection";
import { DeepSeek, Ollama } from '@lobehub/icons';

export const SpiritPanel = () => {
  const [ollamaConfig, setOllamaConfig] = useState({
    endpoint: "http://localhost:11434", 
    apiKey: "", 
  });

  const [deepseekConfig, setDeepseekConfig] = useState({
    apiKey: "",
  });

  return (
    // 主容器文字颜色设置为 #5b4913
    <div className="w-full h-full p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500 text-[#5b4913]">
      
      {/* 页面标题 */}
      <div className="mb-6 px-1">
        <h2 className="text-xl font-bold tracking-tight text-[#5b4913]">
          LLM Providers
        </h2>
      </div>

      {/* 整体容器 
          border: #5b4913/20 (20%透明度的墨色边框)
          bg: #5b4913/5 (5%透明度的墨色背景，形成浅褐色底)
          divide: #5b4913/5 (分割线)
      */}
      <div className="border border-[#5b4913]/20 rounded-xl bg-[#5b4913]/5 shadow-sm overflow-hidden divide-y divide-[#5b4913]/5">
        
        {/* =======================
            1. Ollama Section
           ======================= */}
        <ExpandableMenuSection 
            title="Ollama" 
            defaultOpen={false}
            icon={<Ollama className="w-5 h-5" />}
        >
          <div className="space-y-6 pt-1">
            
            {/* Field: API URL (已更名) */}
            <div className="grid gap-2">
              <label className="text-[10px] uppercase tracking-widest text-[#5b4913]/60 font-bold ml-1 select-none">
                API URL
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={ollamaConfig.endpoint}
                  onChange={(e) => setOllamaConfig({...ollamaConfig, endpoint: e.target.value})}
                  placeholder="http://localhost:11434"
                  // 输入框美化：
                  // bg: #5b4913/10 (比卡片背景稍深，形成凹槽)
                  // text: #5b4913 (深褐墨色)
                  // focus ring: #5b4913/20
                  className="w-full bg-[#5b4913]/10 text-[#5b4913] border-none rounded-lg px-3.5 py-2.5 text-xs font-mono 
                             placeholder:text-[#5b4913]/40 shadow-inner
                             focus:outline-none focus:bg-[#5b4913]/15 focus:ring-1 focus:ring-[#5b4913]/20
                             transition-all duration-200"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Field: API Key */}
            <div className="grid gap-2">
              <label className="text-[10px] uppercase tracking-widest text-[#5b4913]/60 font-bold ml-1 select-none">
                API Key <span className="text-[#5b4913]/40 font-normal normal-case tracking-normal ml-1">(Optional)</span>
              </label>
              <input
                type="password"
                value={ollamaConfig.apiKey}
                onChange={(e) => setOllamaConfig({...ollamaConfig, apiKey: e.target.value})}
                placeholder="No auth required"
                className="w-full bg-[#5b4913]/10 text-[#5b4913] border-none rounded-lg px-3.5 py-2.5 text-xs font-mono 
                           placeholder:text-[#5b4913]/40 shadow-inner
                           focus:outline-none focus:bg-[#5b4913]/15 focus:ring-1 focus:ring-[#5b4913]/20
                           transition-all duration-200"
                autoComplete="off"
              />
            </div>
          </div>
        </ExpandableMenuSection>

        {/* =======================
            2. DeepSeek Section
           ======================= */}
        <ExpandableMenuSection 
            title="DeepSeek" 
            defaultOpen={false} 
            icon={<DeepSeek className="w-5 h-5" />}
        >
          <div className="space-y-6 pt-1">
            <div className="grid gap-2">
              <label className="text-[10px] uppercase tracking-widest text-[#5b4913]/60 font-bold ml-1 select-none">
                API Key
              </label>
              <input
                type="password"
                value={deepseekConfig.apiKey}
                onChange={(e) => setDeepseekConfig({...deepseekConfig, apiKey: e.target.value})}
                placeholder="sk-..."
                className="w-full bg-[#5b4913]/10 text-[#5b4913] border-none rounded-lg px-3.5 py-2.5 text-xs font-mono 
                           placeholder:text-[#5b4913]/40 shadow-inner
                           focus:outline-none focus:bg-[#5b4913]/15 focus:ring-1 focus:ring-[#5b4913]/20
                           transition-all duration-200"
                autoComplete="off"
              />
               {/* 下方小字已移除 */}
            </div>
          </div>
        </ExpandableMenuSection>

      </div>
    </div>
  );
};