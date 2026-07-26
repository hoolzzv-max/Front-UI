import { create } from "zustand";
import type { ConsoleCommand, ConsoleCommandStatus, ConsoleEntry, ConsoleEntryType } from "../types";

type ConsoleState = {
  entries: ConsoleEntry[];
  commands: ConsoleCommand[];
  history: string[];
  currentWorkingDirectory: string;
  isRunning: boolean;
  appendEntry: (entry: { type: ConsoleEntryType; content: string; commandId?: string }) => ConsoleEntry;
  runCommand: (command: string) => Promise<void>;
  setCommandStatus: (commandId: string, status: ConsoleCommandStatus, exitCode?: number) => void;
  clear: () => void;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() { return new Date().toISOString(); }

function createEntry(params: { type: ConsoleEntryType; content: string; commandId?: string }): ConsoleEntry {
  return { id: createId(), type: params.type, content: params.content, commandId: params.commandId, timestamp: now() };
}

function createCommand(command: string): ConsoleCommand {
  return { id: createId(), command, status: "queued", startedAt: now() };
}

function getLocalCommandOutput(command: string) {
  const trimmed = command.trim();
  if (trimmed === "help") {
    return ["Available local commands:", "  help      Show available commands", "  clear     Clear console output", "  pwd       Print workspace directory", "  status    Show connection status"].join("\n");
  }
  if (trimmed === "pwd") return "/workspace/frontend-ui";
  if (trimmed === "status") {
    return ["Shell: ready", "Frontend: ready", "Backend: not connected", "Agent: not connected"].join("\n");
  }
  return [`Command queued locally: ${trimmed}`, "Backend terminal execution is not connected yet."].join("\n");
}

export const useConsoleStore = create<ConsoleState>((set, get) => ({
  entries: [createEntry({ type: "system", content: "Console ready. Local shell UI is active. Backend terminal execution is pending." })],
  commands: [], history: [], currentWorkingDirectory: "/workspace/frontend-ui", isRunning: false,

  appendEntry: (entry) => {
    const nextEntry = createEntry(entry);
    set((state) => ({ entries: [...state.entries, nextEntry] }));
    return nextEntry;
  },

  runCommand: async (command) => {
    const cleanCommand = command.trim();
    if (!cleanCommand) return;
    if (cleanCommand === "clear") { get().clear(); return; }
    const consoleCommand = createCommand(cleanCommand);
    set((state) => ({
      isRunning: true,
      commands: [...state.commands, { ...consoleCommand, status: "running" }],
      history: state.history.at(-1) === cleanCommand ? state.history : [...state.history, cleanCommand],
      entries: [...state.entries, createEntry({ type: "input", content: cleanCommand, commandId: consoleCommand.id })],
    }));
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      const output = getLocalCommandOutput(cleanCommand);
      set((state) => ({
        isRunning: false,
        entries: [...state.entries, createEntry({ type: "output", content: output, commandId: consoleCommand.id })],
        commands: state.commands.map((item) => item.id === consoleCommand.id ? { ...item, status: "completed", completedAt: now(), exitCode: 0 } : item),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown console error";
      set((state) => ({
        isRunning: false,
        entries: [...state.entries, createEntry({ type: "error", content: message, commandId: consoleCommand.id })],
        commands: state.commands.map((item) => item.id === consoleCommand.id ? { ...item, status: "failed", completedAt: now(), exitCode: 1 } : item),
      }));
    }
  },

  setCommandStatus: (commandId, status, exitCode) => {
    set((state) => ({
      commands: state.commands.map((command) => command.id === commandId ? { ...command, status, exitCode, completedAt: status === "completed" || status === "failed" || status === "cancelled" ? now() : command.completedAt } : command),
    }));
  },

  clear: () => {
    set({ entries: [createEntry({ type: "system", content: "Console cleared." })], commands: [], isRunning: false });
  },
}));
