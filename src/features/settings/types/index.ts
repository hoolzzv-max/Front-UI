import type { AgentTransportType } from "@/agents";

export type ThemeMode = "dark" | "light" | "system";

export interface ConnectionSettings {
  apiUrl: string;
  websocketUrl: string;
  token: string;
  transportType: AgentTransportType;
}

export interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
}

export interface ApplicationSettings {
  theme: ThemeMode;
  connection: ConnectionSettings;
  editor: EditorSettings;
}
