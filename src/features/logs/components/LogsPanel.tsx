import { Bug, CheckCircle2, Circle, Trash2, TriangleAlert } from "lucide-react";
import { useLogs } from "../hooks/useLogs";
import type { LogFilter } from "../types";
import type { LogEntry } from "../../../types/log";

const filters: LogFilter[] = [
  "all",
  "info",
  "success",
  "warning",
  "error",
  "debug",
];

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

function LogIcon({ level }: { level: LogEntry["level"] }) {
  if (level === "success") {
    return <CheckCircle2 size={15} className="text-emerald-400" />;
  }

  if (level === "warning") {
    return <TriangleAlert size={15} className="text-yellow-400" />;
  }

  if (level === "error") {
    return <TriangleAlert size={15} className="text-red-400" />;
  }

  if (level === "debug") {
    return <Bug size={15} className="text-purple-400" />;
  }

  return <Circle size={15} className="text-blue-400" />;
}

function getLevelTextClass(level: LogEntry["level"]) {
  if (level === "success") return "text-emerald-300";
  if (level === "warning") return "text-yellow-300";
  if (level === "error") return "text-red-300";
  if (level === "debug") return "text-purple-300";
  return "text-blue-300";
}

export function LogsPanel() {
  const { filter, setFilter, clearLogs, filteredLogs } = useLogs();

  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-950">
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-neutral-800 px-3">
        <div className="flex items-center gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={[
                "rounded-lg px-2 py-1 text-[11px] capitalize transition",
                filter === item
                  ? "bg-blue-500/10 text-blue-300"
                  : "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200",
              ].join(" ")}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={clearLogs}
          className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
          title="Clear logs"
        >
          <Trash2 size={14} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-3">
        {filteredLogs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-600">
            No logs.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <article
                key={log.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <LogIcon level={log.level} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "text-[11px] font-semibold uppercase",
                          getLevelTextClass(log.level),
                        ].join(" ")}
                      >
                        {log.level}
                      </span>

                      <span className="text-[11px] text-neutral-600">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-neutral-300">
                      {log.message}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
