import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Circle, Terminal, Trash2 } from "lucide-react";
import { useConsole } from "../hooks/useConsole";
import type { ConsoleEntry } from "../types";

function formatTime(value: string) {
  try { return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value)); }
  catch { return ""; }
}

function getEntryClassName(entry: ConsoleEntry) {
  if (entry.type === "input") return "text-blue-300";
  if (entry.type === "output") return "text-neutral-300";
  if (entry.type === "error") return "text-red-300";
  return "text-neutral-500";
}

function getPrefix(entry: ConsoleEntry) {
  if (entry.type === "input") return "$";
  if (entry.type === "error") return "!";
  if (entry.type === "system") return "•";
  return " ";
}

export function ConsolePanel() {
  const { entries, history, currentWorkingDirectory, isRunning, runCommand, clear } = useConsole();
  const [value, setValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [entries.length]);

  const submit = async () => {
    const command = value.trim();
    if (!command || isRunning) return;
    setValue("");
    setHistoryIndex(null);
    await runCommand(command);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); await submit(); };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setValue(history[nextIndex] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) { setHistoryIndex(null); setValue(""); }
      else { setHistoryIndex(nextIndex); setValue(history[nextIndex] ?? ""); }
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-950">
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-neutral-800 px-3">
        <div className="flex items-center gap-2 text-xs">
          <Terminal size={14} className="text-neutral-500" />
          <span className="text-neutral-400">Console</span>
          {isRunning && <Circle size={8} className="animate-pulse text-yellow-400" />}
        </div>
        <button type="button" onClick={clear} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100" title="Clear console">
          <Trash2 size={14} />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <div className="space-y-1 font-mono text-xs leading-5">
          {entries.map((entry) => (
            <div key={entry.id} className="flex gap-2">
              <span className="shrink-0 text-neutral-600">{getPrefix(entry)}</span>
              <span className={getEntryClassName(entry)}>{entry.content}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="shrink-0 border-t border-neutral-800 p-3">
        <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2">
          <span className="shrink-0 font-mono text-xs text-neutral-600">$</span>
          <input ref={inputRef} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={handleKeyDown} placeholder="Enter command..." className="flex-1 bg-transparent font-mono text-xs text-neutral-100 outline-none placeholder:text-neutral-600" />
          <span className="shrink-0 text-[11px] text-neutral-600">{currentWorkingDirectory}</span>
        </div>
      </form>
    </section>
  );
}
