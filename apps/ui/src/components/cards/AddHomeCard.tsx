import { Home } from "lucide-react";
import { useServerStore } from "@/store/useServerStore";
import { NODE_CATEGORIES } from "@/config/node";
import { BaseActionCard } from "../base/BaseActionCard";
import { memo } from "react";

export const AddHomeCard = memo(() => {
  const addNode = useServerStore((state) => state.addNode);

  return (
    <BaseActionCard
      icon={Home}
      title="Access Home Apiary"
      onClick={() => addNode(NODE_CATEGORIES.HOME)}
      className="relative"
    />
  );
});
