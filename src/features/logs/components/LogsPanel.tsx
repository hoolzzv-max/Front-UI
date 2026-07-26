import { Info, Trash2, TriangleAlert, XCircle, CheckCircle } from "lucide-react";
import { useLogs } from "../hooks/useLogs";
import type { LogEntry } from "../types";

function getLevelIcon(level: LogEntry["level"]) {
  if (level === "error") return <XCircle size={14} className="text-red-400" />;
  if (level === "warning") return <TriangleAlert size={14} className="text-yellow-400" />;
  if (level === "success") return <CheckCircle size={14} className="text-emerald-400" />;
  return <Info size={14} className="text-blue-400" />;
}

function formatTime(value: string) {
  try { return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value)); }
  catch { return ""; }
}

export function LogsPanel() {
  const { logs, clearLogs } = useLogs();
  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-950">
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-neutral-800 px-3">
        <span className="text-xs text-neutral-400">Logs</span>
        <button type="button" onClick={clearLogs} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100" title="Clear logs">
          <Trash2 size={14} />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {logs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-600">No logs.</div>
        ) : (
          <div className="space-y-1 font-mono text-xs leading-5">
            {logs.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2">
                <span className="shrink-0 text-neutral-600">{formatTime(entry.timestamp)}</span>
                <span className="shrink-0">{getLevelIcon(entry.level)}</span>
                <span className="text-neutral-300">{entry.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
