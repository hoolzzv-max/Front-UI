import { eventBus } from "../events/EventBus";
import { useLogsStore } from "@/features/logs/store/logsStore";
import { useConsoleStore } from "@/features/console/store/consoleStore";
import { useDiagnosticsStore } from "@/features/diagnostics/store/diagnosticsStore";

let initialized = false;

export function registerEventHandlers() {
  if (initialized) { return; }
  initialized = true;

  eventBus.on("websocket:status", ({ status }) => {
    useLogsStore.getState().addLog({ level: "info", message: `WebSocket status changed: ${status}` });
    useConsoleStore.getState().appendEntry({ type: "system", content: `WebSocket: ${status}` });
  });

  eventBus.on("websocket:message", ({ type, payload }) => {
    useLogsStore.getState().addLog({ level: "info", message: `WebSocket message received (${type ?? "unknown"})` });
    useConsoleStore.getState().appendEntry({ type: "output", content: JSON.stringify(payload, null, 2) });
  });

  eventBus.on("websocket:error", ({ message }) => {
    useLogsStore.getState().addLog({ level: "error", message });
    useConsoleStore.getState().appendEntry({ type: "error", content: message });
    useDiagnosticsStore.getState().addDiagnostic({ source: "backend", severity: "error", message });
  });

  eventBus.on("api:error", ({ message }) => {
    useLogsStore.getState().addLog({ level: "error", message });
    useDiagnosticsStore.getState().addDiagnostic({ source: "backend", severity: "error", message });
  });

  eventBus.on("agent:task-created", ({ taskId, title }) => {
    useLogsStore.getState().addLog({ level: "info", message: `Task created: ${title} (${taskId})` });
  });

  eventBus.on("agent:message", ({ content }) => {
    useConsoleStore.getState().appendEntry({ type: "output", content });
    useLogsStore.getState().addLog({ level: "info", message: "Agent output received." });
  });

  eventBus.on("agent:error", ({ message }) => {
    useLogsStore.getState().addLog({ level: "error", message });
    useDiagnosticsStore.getState().addDiagnostic({ source: "agent", severity: "error", message });
  });
}
