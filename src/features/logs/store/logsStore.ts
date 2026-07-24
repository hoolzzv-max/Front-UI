import { create } from "zustand";
import type { LogEntry, LogLevel } from "../../../types/log";
import type { CreateLogInput, LogFilter } from "../types";

type LogsState = {
  logs: LogEntry[];
  filter: LogFilter;

  addLog: (input: CreateLogInput) => LogEntry;
  setFilter: (filter: LogFilter) => void;
  clearLogs: () => void;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() {
  return new Date().toISOString();
}

function createLog(level: LogLevel, message: string): LogEntry {
  return {
    id: createId(),
    level,
    message,
    timestamp: now(),
  };
}

export const useLogsStore = create<LogsState>((set) => ({
  logs: [
    createLog("info", "Workspace shell mounted."),
    createLog("success", "Providers initialized."),
    createLog("info", "Chat, Editor, Explorer and Prompt features loaded."),
    createLog("warning", "Backend integration is not connected yet."),
  ],

  filter: "all",

  addLog: (input) => {
    const log = createLog(input.level, input.message);

    set((state) => ({
      logs: [...state.logs, log],
    }));

    return log;
  },

  setFilter: (filter) => {
    set({
      filter,
    });
  },

  clearLogs: () => {
    set({
      logs: [],
    });
  },
}));
