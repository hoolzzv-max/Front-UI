import { FormEvent, KeyboardEvent, useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { MessageList } from "./MessageList";

export function ChatPanel() {
  const { messages, isSubmitting, error, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState("");

  const submit = async () => {
    const value = input.trim();
    if (!value || isSubmitting) return;
    setInput("");
    await sendMessage(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit();
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") return;
    if (event.shiftKey) return;
    event.preventDefault();
    await submit();
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-950">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-800 px-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">Chat</h2>
          <p className="text-xs text-neutral-500">Agent conversation workspace</p>
        </div>
        <button onClick={clearMessages} type="button" className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-neutral-700 hover:text-neutral-100">
          <Trash2 size={14} />
          Clear
        </button>
      </header>
      <div className="min-h-0 flex-1"><MessageList messages={messages} /></div>
      {error && <div className="border-t border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-300">{error}</div>}
      <form onSubmit={handleSubmit} className="shrink-0 border-t border-neutral-800 bg-neutral-950 p-3">
        <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-2">
          <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} rows={1} placeholder="Enter your instructions..." className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-neutral-100 outline-none placeholder:text-neutral-600" />
          <button type="submit" disabled={!input.trim() || isSubmitting} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message">
            <Send size={17} />
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-4xl px-1 text-[11px] text-neutral-600">Enter to send, Shift + Enter for new line.</p>
      </form>
    </section>
  );
}
