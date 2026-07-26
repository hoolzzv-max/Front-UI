import type { AgentConnectionConfig } from "@/agents";

export interface SettingsResponse {
  apiUrl: string;
  websocketUrl: string;
  token?: string;
}

export function toConnectionConfig(response: SettingsResponse): AgentConnectionConfig {
  return {
    apiUrl: response.apiUrl,
    websocketUrl: response.websocketUrl || undefined,
    token: response.token,
    transportType: "http",
  };
}
