// apps/ui/src/components/settings/SettingsModal.tsx
// TODO：精修
import React, { useEffect, useState } from 'react';
import { useSettingsStore, type SettingsTab } from '../../store/SettingsStore';
import { 
  X, 
  Monitor, 
  Bot,     
  ScrollText, 
  Hexagon, 
  Warehouse, 
  Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { invoke } from '@tauri-apps/api/core';

// 定义侧边栏选项
const SETTINGS_TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Monitor },
  { id: 'scispirit', label: 'Spirit (AI)', icon: Bot },
  { id: 'sciscript', label: 'Script', icon: ScrollText },
  { id: 'scicomb', label: 'Comb', icon: Hexagon },
  { id: 'scicellar', label: 'Cellar', icon: Warehouse },
];

// === 1. 定义清晰的接口 ===

// 前端表单用的状态 (CamelCase 驼峰)
interface FormConfig {
  provider: string;
  apiKey: string;   // <--- 前端统一用 apiKey
  model: string;
}

// 后端 Rust 返回的数据结构 (Snake_case 下划线)
interface RustConfig {
  provider: string;
  api_key: string;  // <--- 后端是 api_key
  model: string;
}

export const SettingsModal = () => {
  const { isOpen, closeSettings, activeTab, setTab } = useSettingsStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeSettings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeSettings} />

      <div className="relative w-200 h-137.5 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl flex overflow-hidden border border-slate-200 dark:border-[#333] animate-in zoom-in-95 duration-200">
        
        {/* --- 左侧侧边栏 --- */}
        <div className="w-64 bg-slate-50 dark:bg-[#252526] border-r border-slate-200 dark:border-[#333] flex flex-col py-4">
          <div className="px-6 mb-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Settings</h2>
          </div>
          
          <div className="flex-1 px-3 space-y-1">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-white dark:bg-[#37373d] text-blue-600 dark:text-blue-400 shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-[#2d2d2d]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- 右侧内容区 --- */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1e1e1e]">
          {/* 标题栏 */}
          <div className="h-14 border-b border-slate-100 dark:border-[#333] flex items-center justify-between px-8 shrink-0">
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {SETTINGS_TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <button 
              onClick={closeSettings}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#333] text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 内容滚动区 */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'scispirit' && <SpiritSettings />}
            {activeTab === 'sciscript' && <PlaceholderSettings name="Script" />}
            {activeTab === 'scicomb' && <PlaceholderSettings name="Comb" />}
            {activeTab === 'scicellar' && <PlaceholderSettings name="Cellar" />}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 子组件 ---
const GeneralSettings = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-200">Appearance</h3>
      <div className="p-4 rounded-lg border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#252526]">
        <p className="text-sm text-slate-500">Theme settings will be implemented here.</p>
      </div>
    </div>
  </div>
);

const PlaceholderSettings = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400">
    <div className="p-4 rounded-full bg-slate-100 dark:bg-[#252526] mb-4">
      <Monitor className="w-8 h-8 opacity-50" />
    </div>
    <p>Settings for {name} are coming soon.</p>
  </div>
);

const SpiritSettings = () => {
  // === 2. 使用 FormConfig 接口 (apiKey) ===
  const [formData, setFormData] = useState<FormConfig>({
    provider: 'openai',
    apiKey: '', 
    model: 'gpt-4o',
  });
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  // 初始化时获取当前配置
  useEffect(() => {
    // 泛型指定为 RustConfig (api_key)
    invoke<RustConfig | null>('get_llm_config')
      .then((res) => {
        if (res) {
          // === 3. 映射: Rust(api_key) -> State(apiKey) ===
          setFormData({
            provider: res.provider || 'openai',
            apiKey: res.api_key || '', 
            model: res.model || 'gpt-4o'
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleTest = async () => {
    setStatus('testing');
    try {
      // === 4. 映射: State(apiKey) -> Rust(api_key) ===
      const res = await invoke<string>('verify_llm_config', {
        config: {
          provider: formData.provider,
          api_key: formData.apiKey, 
          model: formData.model
        }
      });
      setStatus('success');
      setMsg(res || 'Connection successful');
    } catch (err) {
      setStatus('error');
      setMsg(String(err));
    }
  };

  const handleSave = async () => {
    try {
      await invoke('set_llm_config', {
        config: {
            provider: formData.provider,
            api_key: formData.apiKey,
            model: formData.model
        }
      });
      setStatus('success');
      setMsg('Configuration saved successfully');
    } catch (err) {
      setStatus('error');
      setMsg('Failed to save: ' + err);
    }
  };

  return (
    <div className="max-w-md space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Provider</label>
        <select 
          className="w-full px-3 py-2 bg-white dark:bg-[#2d2d2d] border border-slate-300 dark:border-[#3e3e3e] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.provider}
          onChange={e => setFormData({...formData, provider: e.target.value})}
        >
          <option value="openai">OpenAI</option>
          <option value="claude">Anthropic (Claude)</option>
          <option value="ollama">Ollama (Local)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">API Key</label>
        <input 
          type="password"
          className="w-full px-3 py-2 bg-white dark:bg-[#2d2d2d] border border-slate-300 dark:border-[#3e3e3e] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          placeholder="sk-..."
          value={formData.apiKey}
          // 现在类型匹配了，不会报错
          onChange={e => setFormData({...formData, apiKey: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Model Name</label>
        <input 
          type="text"
          className="w-full px-3 py-2 bg-white dark:bg-[#2d2d2d] border border-slate-300 dark:border-[#3e3e3e] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. gpt-4-turbo"
          value={formData.model}
          onChange={e => setFormData({...formData, model: e.target.value})}
        />
      </div>

      {status !== 'idle' && (
        <div className={cn(
          "p-3 rounded-md text-xs flex items-start gap-2",
          status === 'error' ? "bg-red-50 text-red-600 dark:bg-red-900/20" : 
          status === 'success' ? "bg-green-50 text-green-600 dark:bg-green-900/20" :
          "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
        )}>
          {status === 'testing' && "Connecting..."}
          {(status === 'success') && <Check className="w-4 h-4 shrink-0" />}
          {msg}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button 
          onClick={handleTest}
          disabled={status === 'testing' || !formData.apiKey}
          className="flex-1 px-4 py-2 border border-slate-300 dark:border-[#3e3e3e] text-slate-700 dark:text-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#2d2d2d] disabled:opacity-50"
        >
          Test Connection
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};