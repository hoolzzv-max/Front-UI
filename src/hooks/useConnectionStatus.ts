import { useEffect, useState } from "react";
import { agentService } from "@/agents";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import type { AgentConnectionStatus } from "@/agents";

export function useConnectionStatus() {
  const connectionStatus = useSettingsStore((s) => s.connectionStatus);
  const [agentStatus, setAgentStatus] = useState<AgentConnectionStatus>(
    agentService.getStatus().status,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAgentStatus(agentService.getStatus().status);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const isConnected =
    connectionStatus === "connected" || agentStatus === "connected";

  const isConnecting =
    connectionStatus === "connecting" || agentStatus === "connecting";

  const isReconnecting = agentStatus === "reconnecting";

  const isError =
    connectionStatus === "failed" || agentStatus === "error";

  const status: AgentConnectionStatus = isError
    ? "error"
    : isReconnecting
      ? "reconnecting"
      : isConnecting
        ? "connecting"
        : isConnected
          ? "connected"
          : "disconnected";

  return {
    status,
    isConnected,
    isConnecting,
    isReconnecting,
    isError,
    agentDisplayName: agentService.getDisplayName(),
    capabilities: agentService.getCapabilities(),
  };
}
