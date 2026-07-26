import { agentService } from "@/agents";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

const STATUS_COLORS: Record<string, string> = {
  connected: "text-emerald-400",
  connecting: "text-yellow-400",
  reconnecting: "text-orange-400",
  error: "text-red-400",
  disconnected: "text-neutral-500",
  unknown: "text-neutral-500",
};

const STATUS_DOTS: Record<string, string> = {
  connected: "bg-emerald-400",
  connecting: "bg-yellow-400",
  reconnecting: "bg-orange-400",
  error: "bg-red-400",
  disconnected: "bg-neutral-600",
  unknown: "bg-neutral-600",
};

export function StatusBar() {
  const { status, agentDisplayName } = useConnectionStatus();
  const agentStatus = agentService.getStatus();

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-3 text-xs text-neutral-500">
      <div className="flex min-w-0 items-center gap-4">
        <span className={`flex items-center gap-1.5 ${STATUS_COLORS[status] ?? "text-neutral-500"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status] ?? "bg-neutral-600"}`} />
          <span className="capitalize">{status}</span>
        </span>

        <span className="hidden sm:inline">Agent: {agentDisplayName}</span>
        {agentStatus.model && (
          <span className="hidden md:inline">Model: {agentStatus.model}</span>
        )}
      </div>

      <div className="flex min-w-0 items-center gap-4">
        {agentStatus.workspace && (
          <span className="hidden sm:inline">Workspace: {agentStatus.workspace}</span>
        )}
        <span>UTF-8</span>
        <span>TypeScript</span>
      </div>
    </footer>
  );
}
