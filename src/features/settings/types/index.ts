export type ThemeMode = "dark" | "light" | "system";

export interface ConnectionSettings {
  /** Base HTTP URL of the agent backend */
  agentUrl: string;
  /** WebSocket URL for streaming (optional) */
  websocketUrl: string;
  /** Bearer auth token (optional) */
  token: string;
  /** Transport preference */
  transport: "http" | "websocket" | "sse";
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
