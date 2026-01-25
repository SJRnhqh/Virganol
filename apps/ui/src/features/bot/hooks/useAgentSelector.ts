// apps/ui/src/features/bot/hooks/useAgentSelector.ts
import { useState, useRef, useEffect, useCallback } from "react";
import { type AgentType } from "../config/agents";

interface UseAgentSelectorProps {
  onSelect: (agentId: AgentType) => void;
}

export function useAgentSelector({ onSelect }: UseAgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🖱️ 点击外部自动关闭逻辑
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    // 只有在打开时才添加监听，性能更优
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // 🔄 切换开关
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // ✅ 处理选择并自动关闭
  const handleSelect = useCallback(
    (id: AgentType) => {
      onSelect(id);
      setIsOpen(false);
    },
    [onSelect]
  );

  return {
    isOpen,
    containerRef,
    toggle,
    handleSelect,
  };
}