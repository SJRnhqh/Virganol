// apps/ui/src/components/deck/NodeTerminal.tsx
import { useRef } from "react";
import { BaseTerminal, type TerminalRef } from "@/components/base/BaseTerminal";
import { usePtySession } from "../../hooks/usePtySession";

interface NodeTerminalProps {
  nodeId: string;
  className?: string;
}

export const NodeTerminal = ({ nodeId, className }: NodeTerminalProps) => {
  // 1. 持有 Ref
  const terminalRef = useRef<TerminalRef>(null);

  // 2. 委托生命周期给 Hook (Smart Logic)
  // Hook 内部负责 init, logging, error handling
  const { sendInput } = usePtySession({
    nodeId,
    terminalRef,
  });

  return (
    // 3. 纯展示 (Dumb UI)
    <BaseTerminal
      ref={terminalRef}
      className={className}
      onData={sendInput}
      // 可以传入默认配置，比如字体大小等
      options={{ fontSize: 13, fontFamily: "JetBrains Mono" }}
    />
  );
};
