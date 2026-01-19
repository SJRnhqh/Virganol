import { memo } from "react";
import { Server, Plus } from "lucide-react";
import { useServerStore } from "@/store/useServerStore";
import { BaseActionCard } from "@/components/base/BaseActionCard";

export const AddServerCard = memo(() => {
  const toggleSettings = useServerStore((state) => state.toggleSettings);

  return (
    <BaseActionCard
      icon={Server}
      badgeIcon={Plus}
      onClick={() => toggleSettings(true)}
      title="Deploy New Node"
      // 🌟 移除 fixed 定位类名，只保留相对尺寸或微调
      className="relative"
    />
  );
});
