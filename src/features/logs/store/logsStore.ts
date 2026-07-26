import { create } from "zustand";
import type { LogEntry, LogLevel } from "../types";

type LogsState = {
  logs: LogEntry[];
  addLog: (input: { level: LogLevel; message: string; source?: string }) => LogEntry;
  clearLogs: () => void;
  getCounts: () => { total: number; info: number; warning: number; error: number };
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() { return new Date().toISOString(); }

export const useLogsStore = create<LogsState>((set, get) => ({
  logs: [
    { id: createId(), level: "info", message: "Application started.", timestamp: now() },
  ],

  addLog: (input) => {
    const entry: LogEntry = { id: createId(), level: input.level, message: input.message, timestamp: now(), source: input.source };
    set((state) => ({ logs: [...state.logs, entry] }));
    return entry;
  },

  clearLogs: () => { set({ logs: [] }); },

  getCounts: () => {
    const logs = get().logs;
    return {
      total: logs.length,
      info: logs.filter((l) => l.level === "info").length,
      warning: logs.filter((l) => l.level === "warning").length,
      error: logs.filter((l) => l.level === "error").length,
    };
  },
}));
