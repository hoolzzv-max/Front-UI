import { eventBus } from "../events/EventBus";
import { useLogsStore } from "../../features/logs/store/logsStore";
import { useConsoleStore } from "../../features/console/store/consoleStore";
import { useDiagnosticsStore } from "../../features/diagnostics/store/diagnosticsStore";

let initialized = false;

export function registerEventHandlers() {
  if (initialized) return;
  initialized = true;

  // WebSocket Status
  eventBus.on("websocket:status", ({ status }) => {
    useLogsStore.getState().addLog({
      level: "info",
      message: `WebSocket status: ${status}`,
    });
    useConsoleStore.getState().appendEntry({
      type: "system",
      content: `WebSocket: ${status}`,
    });
  });

  // WebSocket Messages
  eventBus.on("websocket:message", ({ type, payload }) => {
    useLogsStore.getState().addLog({
      level: "info",
      message: `WebSocket message (${type ?? "unknown"})`,
    });
    useConsoleStore.getState().appendEntry({
      type: "output",
      content: JSON.stringify(payload, null, 2),
    });
  });

  // WebSocket Errors
  eventBus.on("websocket:error", ({ message }) => {
    useLogsStore.getState().addLog({ level: "error", message });
    useConsoleStore.getState().appendEntry({ type: "error", content: message });
    useDiagnosticsStore.getState().addDiagnostic({
      source: "backend",
      severity: "error",
      message,
    });
  });

  // API Errors
  eventBus.on("api:error", ({ message }) => {
    useLogsStore.getState().addLog({ level: "error", message });
    useDiagnosticsStore.getState().addDiagnostic({
      source: "backend",
      severity: "error",
      message,
    });
  });

  // Task events
  eventBus.on("task:created", ({ taskId, title }) => {
    useLogsStore.getState().addLog({
      level: "info",
      message: `Task created: ${title} (${taskId})`,
    });
  });

  // Generic Agent Messages
  eventBus.on("agent:message", ({ content, taskId }) => {
    useConsoleStore.getState().appendEntry({ type: "output", content });
    useLogsStore.getState().addLog({
      level: "info",
      message: taskId
        ? `Agent output received (task: ${taskId}).`
        : "Agent output received.",
    });
  });

  // Agent Errors
  eventBus.on("agent:error", ({ message }) => {
    useLogsStore.getState().addLog({ level: "error", message });
    useDiagnosticsStore.getState().addDiagnostic({
      source: "backend",
      severity: "error",
      message,
    });
  });

  // Agent Status Changed
  eventBus.on("agent:status-changed", ({ status }) => {
    useLogsStore.getState().addLog({
      level: "info",
      message: `Agent status: ${status}`,
    });
  });

  // Agent Logs
  eventBus.on("agent:log", ({ level, message }) => {
    // Map "warn" → "warning" for LogLevel compatibility
    const logLevel = level === "warn" ? "warning" : level;
    useLogsStore.getState().addLog({ level: logLevel as import("../../types/log").LogLevel, message });
  });
}
