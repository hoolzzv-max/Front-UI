import { Info, Trash2, TriangleAlert, XCircle } from "lucide-react";
import { useDiagnostics } from "../hooks/useDiagnostics";
import type { Diagnostic } from "../types";

function DiagnosticIcon({ severity }: { severity: Diagnostic["severity"] }) {
  if (severity === "error") {
    return <XCircle size={15} className="text-red-400" />;
  }

  if (severity === "warning") {
    return <TriangleAlert size={15} className="text-yellow-400" />;
  }

  return <Info size={15} className="text-blue-400" />;
}

function getSeverityClass(severity: Diagnostic["severity"]) {
  if (severity === "error") return "text-red-300";
  if (severity === "warning") return "text-yellow-300";
  return "text-blue-300";
}

function formatLocation(diagnostic: Diagnostic) {
  if (!diagnostic.filePath) return null;

  const position =
    diagnostic.line !== undefined
      ? `:${diagnostic.line}${diagnostic.column !== undefined ? `:${diagnostic.column}` : ""}`
      : "";

  return `${diagnostic.filePath}${position}`;
}

export function DiagnosticsPanel() {
  const { diagnostics, clearDiagnostics, removeDiagnostic, getCounts } =
    useDiagnostics();

  const counts = getCounts();

  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-950">
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-neutral-800 px-3">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-neutral-400">Diagnostics</span>

          <span className="rounded-md bg-neutral-900 px-2 py-1 text-neutral-500">
            Total {counts.total}
          </span>

          <span className="rounded-md bg-red-500/10 px-2 py-1 text-red-300">
            Errors {counts.error}
          </span>

          <span className="rounded-md bg-yellow-500/10 px-2 py-1 text-yellow-300">
            Warnings {counts.warning}
          </span>
        </div>

        <button
          type="button"
          onClick={clearDiagnostics}
          className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
          title="Clear diagnostics"
        >
          <Trash2 size={14} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-3">
        {diagnostics.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-600">
            No diagnostics.
          </div>
        ) : (
          <div className="space-y-2">
            {diagnostics.map((diagnostic) => {
              const location = formatLocation(diagnostic);

              return (
                <article
                  key={diagnostic.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <DiagnosticIcon severity={diagnostic.severity} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={[
                              "text-[11px] font-semibold uppercase",
                              getSeverityClass(diagnostic.severity),
                            ].join(" ")}
                          >
                            {diagnostic.severity}
                          </span>

                          <span className="truncate text-[11px] text-neutral-600">
                            {diagnostic.source}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeDiagnostic(diagnostic.id)}
                          className="rounded-md p-1 text-neutral-600 hover:bg-neutral-800 hover:text-neutral-100"
                          title="Remove diagnostic"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-neutral-300">
                        {diagnostic.message}
                      </p>

                      {location && (
                        <p className="mt-1 font-mono text-[11px] text-neutral-600">
                          {location}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
