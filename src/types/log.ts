export type LogLevel =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "debug";

export interface LogEntry {
  id: string;

  level: LogLevel;

  message: string;

  timestamp: string;
}
