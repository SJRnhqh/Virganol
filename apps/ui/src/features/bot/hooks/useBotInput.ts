// apps/ui/src/features/bot/hooks/useBotInput.ts
import { useState, useRef, useEffect, useCallback } from "react";
import { useBotStore } from "../store/useBotStore";
import { type AgentType } from "../types/agents";

export function useBotInput() {
  const [value, setValue] = useState("");
  const [currentAgent, setCurrentAgent] = useState<AgentType>("ester");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 从 Store 获取 actions
  const addMessage = useBotStore((state) => state.addMessage);

  // 📐 自动高度逻辑 (Auto-resize)
  useEffect(() => {
    if (textareaRef.current) {
      // 先重置为 auto 以便正确计算 scrollHeight (防止删除文字后高度不缩回)
      textareaRef.current.style.height = "auto";
      // 限制最大高度为 200px
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  // 🚀 发送逻辑
  const handleSend = useCallback(() => {
    if (!value.trim()) return;

    addMessage({
      id: Date.now().toString(),
      role: "user",
      content: value,
      timestamp: Date.now(),
    });

    setValue(""); // 清空输入

    // 发送后重置高度
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, addMessage]);

  // ⌨️ 键盘监听 (Enter 发送)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // 📝 输入变化
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    [],
  );

  return {
    value,
    currentAgent,
    setCurrentAgent,
    textareaRef,
    handleSend,
    handleKeyDown,
    handleChange,
  };
}
