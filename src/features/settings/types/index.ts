export type ThemeMode =
  | "dark"
  | "light"
  | "system";

export interface ConnectionSettings {
  apiUrl: string;
  websocketUrl: string;
  aiderUrl: string;
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
