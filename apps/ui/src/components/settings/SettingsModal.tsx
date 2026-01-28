import { useEffect } from 'react';
import { useSettingsStore } from '../../store/SettingsStore';
import { cn } from '../../lib/utils';
import { SETTINGS_TABS } from '../../constants/settings';
import { motion, AnimatePresence } from 'framer-motion';

// 🟢 引入新的动画变量 (Unfold & FadeUp)
import { 
  modalBackdrop, 
  paperUnfoldVariants,  // 改名了
  contentFadeUp,        // 改名了
  containerStagger      // 改名了
} from '@/lib/animations';

import { SpiritPanel } from './panels/SpiritPanel';
import { GeneralPanel } from './panels/GeneralPanel';
import { ComingSoonPanel } from './panels/ComingSoonPanel';

export const SettingsModal = () => {
  const { isOpen, closeSettings, activeTab, setTab } = useSettingsStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeSettings]);

  const currentTabInfo = SETTINGS_TABS.find(t => t.id === activeTab);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center isolate">
          {/* 遮罩 */}
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/40"
            onClick={closeSettings}
          />

          {/* 纸张容器：3D 展开 */}
          <motion.div
            variants={paperUnfoldVariants} 
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-200 h-137.5 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl flex overflow-hidden border border-slate-200 dark:border-[#333] origin-center"
          >
            
            {/* === 左侧 Sidebar === */}
            <motion.div 
              variants={containerStagger}
              className="w-60 bg-slate-50/50 dark:bg-[#252526]/50 border-r border-slate-200 dark:border-[#333] flex flex-col py-6 backdrop-blur-xl z-10"
            >
              <motion.div variants={contentFadeUp} className="px-6 mb-6">
                <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Settings</h2>
              </motion.div>
              
              <motion.div variants={contentFadeUp} className="flex-1 px-3 space-y-1">
                {SETTINGS_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive 
                          ? "bg-white dark:bg-[#37373d] text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-200 dark:ring-[#444]" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-[#2d2d2d]"
                      )}
                    >
                      <Icon className={cn("w-4.5 h-4.5", isActive ? "text-blue-500" : "text-slate-400")} />
                      {tab.label}
                    </button>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* === 右侧 Main Content === */}
            <motion.div 
              variants={containerStagger}
              className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1e1e1e] relative z-0"
            >
              <motion.div 
                variants={contentFadeUp} 
                className="h-16 border-b border-slate-100 dark:border-[#2d2d2d] flex items-center justify-between px-8 shrink-0 bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-sm"
              >
                <motion.div key={currentTabInfo?.label}>
                  <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {currentTabInfo?.label || 'Unknown'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your configuration for {currentTabInfo?.label}</p>
                </motion.div>
              </motion.div>

              <motion.div 
                variants={contentFadeUp} 
                className="flex-1 overflow-y-auto p-8"
              >
                <div className="max-w-2xl">
                  {/* Tab 切换动画 */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }} // 稍微调慢一点配合整体节奏
                  >
                    {activeTab === 'general' && <GeneralPanel />}
                    {activeTab === 'scispirit' && <SpiritPanel />}
                    {activeTab === 'sciscript' && <ComingSoonPanel name="Script" />}
                    {activeTab === 'scicomb' && <ComingSoonPanel name="Comb" />}
                    {activeTab === 'scicellar' && <ComingSoonPanel name="Cellar" />}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};