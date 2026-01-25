// apps/ui/src/features/bot/views/ChatStream.tsx
import { useBotStore } from "../store/useBotStore";

export function ChatStream() {
  const messages = useBotStore((state) => state.messages);

  return (
    <div className="w-full flex-1 overflow-auto mb-4 p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-4">
             <div className={`font-bold text-xs mt-1 ${msg.role === 'assistant' ? 'text-primary' : 'text-sidebar-fg/50'}`}>
              {msg.role === 'assistant' ? 'AI' : 'YOU'}
            </div>
            <div className="text-sm leading-relaxed text-sidebar-fg/90">
              {msg.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}