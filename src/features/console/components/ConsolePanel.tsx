import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Circle, Terminal, Trash2 } from "lucide-react";
import { useConsole } from "../hooks/useConsole";
import type { ConsoleEntry } from "../types";

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
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
  const {
    entries,
    history,
    currentWorkingDirectory,
    isRunning,
    runCommand,
    clear,
  } = useConsole();

  const [value, setValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [entries.length]);

  const submit = async () => {
    const command = value.trim();

    if (!command || isRunning) return;

    setValue("");
    setHistoryIndex(null);
    await runCommand(command);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (history.length === 0) return;

      const nextIndex =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1);

      setHistoryIndex(nextIndex);
      setValue(history[nextIndex] ?? "");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (history.length === 0 || historyIndex === null) return;

      const nextIndex = historyIndex + 1;

      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setValue("");
        return;
      }

      setHistoryIndex(nextIndex);
      setValue(history[nextIndex] ?? "");
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-950">
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-neutral-800 px-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Terminal size={14} className="text-blue-400" />
          <span>Console</span>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-500">{currentWorkingDirectory}</span>
        </div>

        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="flex items-center gap-1 text-[11px] text-blue-400">
              <Circle size={8} className="fill-blue-400" />
              Running
            </span>
          )}

          <button
            type="button"
            onClick={clear}
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
            title="Clear console"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      <div
        className="min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-xs leading-6"
        onClick={() => inputRef.current?.focus()}
      >
        {entries.map((entry) => (
          <div key={entry.id} className="grid grid-cols-[64px_16px_1fr] gap-2">
            <span className="select-none text-neutral-700">
              {formatTime(entry.timestamp)}
            </span>

            <span className="select-none text-neutral-600">
              {getPrefix(entry)}
            </span>

            <pre
              className={[
                "m-0 whitespace-pre-wrap break-words",
                getEntryClassName(entry),
              ].join(" ")}
            >
              {entry.content}
            </pre>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex h-10 shrink-0 items-center gap-2 border-t border-neutral-800 px-3 font-mono text-xs"
      >
        <span className="text-blue-400">$</span>

        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRunning}
          placeholder="Type command..."
          className="h-full flex-1 bg-transparent text-neutral-100 outline-none placeholder:text-neutral-700 disabled:opacity-50"
        />
      </form>
    </section>
  );
}
