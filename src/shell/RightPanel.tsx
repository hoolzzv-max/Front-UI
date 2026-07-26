import type { SidebarActivity } from "./Sidebar";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { agentService } from "@/agents";

type RightPanelProps = {
  activeView: string;
  activeActivity: SidebarActivity;
};

const STATUS_COLORS: Record<string, string> = {
  connected: "text-emerald-400",
  connecting: "text-yellow-400",
  reconnecting: "text-orange-400",
  error: "text-red-400",
  disconnected: "text-neutral-500",
  unknown: "text-neutral-500",
};

export function RightPanel({ activeView, activeActivity }: RightPanelProps) {
  const { status, agentDisplayName, capabilities } = useConnectionStatus();
  const agentStatus = agentService.getStatus();

  return (
    <aside className="hidden min-w-0 border-l border-neutral-800 bg-neutral-950 lg:block">
      <div className="border-b border-neutral-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-100">Details</h2>
        <p className="mt-0.5 text-xs text-neutral-500">Contextual information</p>
      </div>

      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="text-sm font-medium text-neutral-100">Current Context</h3>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Workspace View</span>
              <span className="rounded-full border border-neutral-700 bg-neutral-950 px-2 py-1 capitalize text-neutral-300">
                {activeView}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Activity</span>
              <span className="rounded-full border border-neutral-700 bg-neutral-950 px-2 py-1 capitalize text-neutral-300">
                {activeActivity}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="text-sm font-medium text-neutral-100">Connection</h3>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Agent</span>
              <span className="text-neutral-300">{agentDisplayName}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Status</span>
              <span className={STATUS_COLORS[status] ?? "text-neutral-500"}>
                <span className="capitalize">{status}</span>
              </span>
            </div>
            {agentStatus.model && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Model</span>
                <span className="text-neutral-300">{agentStatus.model}</span>
              </div>
            )}
            {agentStatus.version && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Version</span>
                <span className="text-neutral-300">{agentStatus.version}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="text-sm font-medium text-neutral-100">Capabilities</h3>
          <div className="mt-4 space-y-2 text-xs">
            {(Object.entries(capabilities) as [string, boolean][]).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className="capitalize text-neutral-500">{key}</span>
                <span className={enabled ? "text-emerald-400" : "text-neutral-600"}>
                  {enabled ? "Supported" : "Not supported"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
