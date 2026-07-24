import { useEffect, useRef } from "react";
import type { Message } from "../../../../types/message";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-sm font-semibold text-neutral-300">
            No messages yet
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            ابدأ بكتابة أول تعليماتك للوكيل.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto px-4 py-5">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
