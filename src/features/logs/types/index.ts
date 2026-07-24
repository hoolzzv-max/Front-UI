import type { LogEntry, LogLevel } from "../../../types/log";

export type AppLogEntry = LogEntry;

export type LogFilter = LogLevel | "all";

export type CreateLogInput = {
  level: LogLevel;
  message: string;
};
