import { Send, Wand2 } from "lucide-react";

import { usePrompt } from "../hooks/usePrompt";
import type { PromptTarget } from "../types";

const TARGETS: { value: PromptTarget; label: string }[] = [
  { value: "chat", label: "Chat" },
  { value: "editor", label: "Editor" },
  { value: "git", label: "Git" },
  { value: "task", label: "Task" },
  { value: "agent", label: "Agent" },
];

export function PromptComposer() {
  const { value, target, setValue, setTarget, sendToAgent } = usePrompt();

  return (
    <div className="border-t border-neutral-800 bg-neutral-950 p-3">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        <div className="flex items-center gap-2">
          <select
            value={target}
            onChange={(event) => setTarget(event.target.value as PromptTarget)}
            className="h-10 rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100 outline-none"
          >
            {TARGETS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <div className="flex flex-1 items-center rounded-xl border border-neutral-800 bg-neutral-900">
            <textarea
              rows={1}
              value={value}
              placeholder="Enter instruction..."
              onChange={(event) => setValue(event.target.value)}
              className="min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600"
            />

            <button
              type="button"
              onClick={() => void sendToAgent()}
              className="m-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500"
            >
              <Send size={15} />
            </button>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 transition hover:text-neutral-100"
            title="Format prompt (coming soon)"
          >
            <Wand2 size={16} />
          </button>
        </div>

        <div className="px-1 text-[11px] text-neutral-600">
          Prompt System Ready
        </div>
      </div>
    </div>
  );
}
