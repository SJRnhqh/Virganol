import { memo } from 'react';
import { useServerStore } from '../store/useServerStore';
import { Server, Plus } from 'lucide-react'; 

export const AddServerCard = memo(() => {
  const toggleSettings = useServerStore((state) => state.toggleSettings);

  return (
    // 定位保持在底部正中央
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => toggleSettings(true)}
        title="Deploy New Node"
        // 样式变更：
        // 1. 变成正方形：w-16 h-16
        // 2. 维持深色背景：bg-[#2F3E46] (你可以改成 bg-[#84A59D] 试试，但我赌你还是会改回来)
        className="group relative flex items-center justify-center w-16 h-16 
          bg-[#2F3E46] text-[#FAF7F0] 
          rounded-2xl shadow-2xl shadow-[#2F3E46]/40 border border-[#E6E1D3]/10 
          overflow-hidden transition-all duration-300 
          hover:scale-110 hover:-translate-y-2 hover:shadow-emerald-900/50 active:scale-95"
      >
        {/* 1. 背景光效 (Hover 时一闪而过) */}
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-[#84A59D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* 2. 核心图标 */}
        <div className="relative z-10">
          {/* 服务器图标 */}
          <Server size={28} strokeWidth={2} className="text-[#FAF7F0] group-hover:text-white transition-colors" />
          
          {/* 右下角的小加号 (作为角标) */}
          <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-[#84A59D] rounded-full flex items-center justify-center border-2 border-[#2F3E46]">
            <Plus size={8} strokeWidth={4} className="text-white" />
          </div>
        </div>

      </button>
    </div>
  );
});