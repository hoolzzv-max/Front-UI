import { useEffect, useState } from "react";
import { eventBus } from "../core/events/EventBus";

type AgentStatus = "unknown" | "online" | "offline";

type StatusBarProps = {
  model?: string;
  workspace?: string;
  branch?: string;
  encoding?: string;
  language?: string;
};

export function StatusBar({
  model = "—",
  workspace = "/workspace",
  branch = "main",
  encoding = "UTF-8",
  language = "TypeScript",
}: StatusBarProps) {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("unknown");

  useEffect(() => {
    const unsub = eventBus.on("agent:status-changed", ({ status }) => {
      setAgentStatus(status === "online" ? "online" : "offline");
    });
    return unsub;
  }, []);

  const statusColors: Record<AgentStatus, string> = {
    unknown: "text-neutral-400",
    online: "text-emerald-400",
    offline: "text-red-400",
  };

  const statusDots: Record<AgentStatus, string> = {
    unknown: "bg-neutral-400",
    online: "bg-emerald-400",
    offline: "bg-red-400",
  };

  const statusLabels: Record<AgentStatus, string> = {
    unknown: "Agent: unknown",
    online: "Agent: online",
    offline: "Agent: offline",
  };

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-3 text-xs text-neutral-500">
      <div className="flex min-w-0 items-center gap-4">
        <span className={`flex items-center gap-1.5 ${statusColors[agentStatus]}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusDots[agentStatus]}`} />
          {statusLabels[agentStatus]}
        </span>

        <span className="hidden sm:inline">Model: {model}</span>
        <span className="hidden md:inline">Workspace: {workspace}</span>
      </div>

      <div className="flex min-w-0 items-center gap-4">
        <span className="hidden sm:inline">Branch: {branch}</span>
        <span>{encoding}</span>
        <span>{language}</span>
      </div>
    </footer>
  );
}
