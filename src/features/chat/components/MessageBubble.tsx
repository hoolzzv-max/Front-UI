import type { Message } from "../../../types/message";

type MessageBubbleProps = {
  message: Message;
};

function getRoleLabel(role: Message["role"]) {
  if (role === "user") return "You";
  if (role === "assistant") return "Assistant";
  return "System";
}

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isError = message.status === "error";
  const isPending = message.status === "pending";
  const isStreaming = message.status === "streaming";

  return (
    <article
      className={[
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "max-w-[85%] rounded-2xl border px-4 py-3 shadow-sm",
          isUser
            ? "border-blue-500/30 bg-blue-500/10 text-blue-50"
            : "border-neutral-800 bg-neutral-900 text-neutral-100",
          isSystem ? "border-neutral-800 bg-neutral-950 text-neutral-400" : "",
          isError ? "border-red-500/30 bg-red-500/10 text-red-100" : "",
        ].join(" ")}
      >
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="text-xs font-medium text-neutral-400">
            {getRoleLabel(message.role)}
          </span>

          <span className="text-[11px] text-neutral-600">
            {formatTime(message.createdAt)}
          </span>
        </div>

        <div className="whitespace-pre-wrap text-sm leading-7">
          {message.content || (isPending ? "Preparing response..." : "")}
          {isStreaming && <span className="ml-1 animate-pulse">▍</span>}
        </div>

        {message.status !== "completed" && (
          <div className="mt-2 text-[11px] capitalize text-neutral-500">
            {message.status}
          </div>
        )}
      </div>
    </article>
  );
}
