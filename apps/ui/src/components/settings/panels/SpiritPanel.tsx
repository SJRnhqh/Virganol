import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// 类型定义最好提取到统一的 types 文件，这里先保留在顶部或从 types 引入
interface FormConfig {
  provider: string;
  apiKey: string;
  model: string;
}

interface RustConfig {
  provider: string;
  api_key: string;
  model: string;
}

export const SpiritPanel = () => {
  const [formData, setFormData] = useState<FormConfig>({
    provider: 'openai',
    apiKey: '', 
    model: 'gpt-4o',
  });
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    invoke<RustConfig | null>('get_llm_config')
      .then((res) => {
        if (res) {
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
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-5">
        {/* Provider Select */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Provider</label>
          <div className="relative">
            <select 
              className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-[#252526] border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-shadow"
              value={formData.provider}
              onChange={e => setFormData({...formData, provider: e.target.value})}
            >
              <option value="openai">OpenAI</option>
              <option value="claude">Anthropic (Claude)</option>
              <option value="ollama">Ollama (Local)</option>
            </select>
          </div>
        </div>

        {/* API Key */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">API Key</label>
          <input 
            type="password"
            className="w-full px-3 py-2.5 bg-white dark:bg-[#252526] border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono placeholder:text-slate-400 transition-shadow"
            placeholder="sk-..."
            value={formData.apiKey}
            onChange={e => setFormData({...formData, apiKey: e.target.value})}
          />
          <p className="text-[10px] text-slate-400">Your key is stored locally and securely encrypted.</p>
        </div>

        {/* Model */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Model Name</label>
          <input 
            type="text"
            className="w-full px-3 py-2.5 bg-white dark:bg-[#252526] border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
            placeholder="e.g. gpt-4-turbo"
            value={formData.model}
            onChange={e => setFormData({...formData, model: e.target.value})}
          />
        </div>
      </div>

      {/* Status Bar */}
      {status !== 'idle' && (
        <div className={cn(
          "p-3 rounded-lg text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1",
          status === 'error' ? "bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/10 dark:border-red-900/20" : 
          status === 'success' ? "bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/10 dark:border-green-900/20" :
          "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20"
        )}>
          {status === 'testing' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
          {status === 'success' && <Check className="w-4 h-4 shrink-0" />}
          <span className="font-medium">{status === 'testing' ? "Connecting to provider..." : msg}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button 
          onClick={handleTest}
          disabled={status === 'testing' || !formData.apiKey}
          className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-[#333] text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#2d2d2d] disabled:opacity-50 transition-colors"
        >
          Test Connection
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all hover:shadow-blue-500/40 active:scale-[0.98]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};