// apps/ui/src/components/settings/SettingsModal.tsx
// 外部依赖
import { motion, AnimatePresence } from "framer-motion";

// 内部引用
import { SpiritPanel, GeneralPanel, ComingSoonPanel } from "./panels";
import { SettingsSidebar } from "./sidebar/SettingsSidebar";
import { useSettingsStore } from "@/store/SettingsStore";
import { SETTINGS_TABS } from "@/constants/settings";
import { cn, modalBackdrop, paperUnfoldVariants } from "@/lib";

export const SettingsModal = () => {
  // 1. 从全局 Store 获取状态
  // isOpen: 控制模态框显示/隐藏
  // activeTab: 当前选中的是哪个设置项（如 'general', 'scispirit'）
  const { isOpen, closeSettings, activeTab, setTab } = useSettingsStore();

  // 2. 计算当前 Tab 信息
  // 用于在右侧 Header 显示当前的标题和描述
  const currentTabInfo = SETTINGS_TABS.find((t) => t.id === activeTab);

  return (
    // AnimatePresence: 允许 React 组件在从 DOM 移除时播放退出动画 (exit prop)
    <AnimatePresence>
      {isOpen && (
        // 全屏定位容
        <div className="fixed inset-0 z-100 flex items-center justify-center isolate">
          {/* 遮罩 */}
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-settings-outlay"
            onClick={closeSettings}
          />

          {/* 纸张容器：3D 展开 */}
          <motion.div
            variants={paperUnfoldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              // 1. 布局核心 (Layout Core)
              // relative: 为内部绝对定位元素提供锚点
              // flex: 左右布局容器
              // overflow-hidden: 确保圆角切边生效，防止子元素溢出
              // origin-center: 动画展开的中心点
              "relative flex overflow-hidden origin-center",

              // 2. 尺寸设定 (Dimensions)
              // 如果要改成全屏或不同大小，改这里
              "w-200 h-137.5",

              // 3. 物理质感 (Physical Material)
              // 形状(圆角)和立体感(阴影)
              "rounded-3xl shadow-3xl",
            )}
          >
            {/* === 左侧 Sidebar === */}
            <SettingsSidebar activeTab={activeTab} setTab={setTab} />

            {/* TODO: 美化重构 */}
            {/* === 右侧 Main Content === */}
            <motion.div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1e1e1e] relative z-0">
              <motion.div className="h-16 border-b border-slate-100 dark:border-[#2d2d2d] flex items-center justify-between px-8 shrink-0 bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-sm">
                <motion.div key={currentTabInfo?.label}>
                  <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {currentTabInfo?.label || "Unknown"}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your configuration for {currentTabInfo?.label}
                  </p>
                </motion.div>
              </motion.div>

              <motion.div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-2xl">
                  {/* Tab 切换动画 */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }} // 稍微调慢一点配合整体节奏
                  >
                    {activeTab === "general" && <GeneralPanel />}
                    {activeTab === "scispirit" && <SpiritPanel />}
                    {activeTab === "sciscript" && (
                      <ComingSoonPanel name="Script" />
                    )}
                    {activeTab === "scicomb" && <ComingSoonPanel name="Comb" />}
                    {activeTab === "scicellar" && (
                      <ComingSoonPanel name="Cellar" />
                    )}
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
