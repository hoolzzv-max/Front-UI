// ============================================================
// Generic Agent Types — no specific agent name is referenced.
// All features communicate through these contracts only.
// ============================================================

export type AgentConnectionStatus =
  | "unknown"
  | "online"
  | "offline";

export type AgentTransportType = "http" | "websocket" | "sse";

export interface AgentConnectionConfig {
  /** Base HTTP URL of the agent backend */
  apiUrl: string;
  /** WebSocket URL for streaming (optional) */
  websocketUrl?: string;
  /** Bearer auth token (optional) */
  token?: string;
  /** Preferred transport */
  transport?: AgentTransportType;
}

export interface AgentStatus {
  status: AgentConnectionStatus;
  version?: string;
  model?: string;
  workspace?: string;
}

export interface AgentInstruction {
  prompt: string;
  files?: string[];
  context?: string;
  taskId?: string;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  taskId?: string;
}

export interface AgentCancelResult {
  success: boolean;
  taskId: string;
}

export interface AgentCapabilities {
  /** Whether the agent supports streaming responses */
  streaming: boolean;
  /** Whether the agent exposes a file system */
  fileSystem: boolean;
  /** Whether the agent supports git operations */
  git: boolean;
  /** Whether the agent supports task management */
  tasks: boolean;
  /** Whether the agent supports diagnostic output */
  diagnostics: boolean;
}

export const DEFAULT_CAPABILITIES: AgentCapabilities = {
  streaming: false,
  fileSystem: false,
  git: false,
  tasks: false,
  diagnostics: false,
};
