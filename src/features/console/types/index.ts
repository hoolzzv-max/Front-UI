export type ConsoleEntryType = "input" | "output" | "error" | "system";

export type ConsoleCommandStatus =
  | "idle"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface ConsoleEntry {
  id: string;
  type: ConsoleEntryType;
  content: string;
  timestamp: string;
  commandId?: string;
}

export interface ConsoleCommand {
  id: string;
  command: string;
  status: ConsoleCommandStatus;
  startedAt: string;
  completedAt?: string;
  exitCode?: number;
}
