export type AgentConnectionStatus =
  | "disconnected" | "connecting" | "connected" | "reconnecting" | "error" | "unknown";

export type AgentTransportType = "http" | "websocket" | "sse";

export interface AgentConnectionConfig {
  apiUrl: string;
  websocketUrl?: string;
  sseUrl?: string;
  token?: string;
  transportType?: AgentTransportType;
}

export interface AgentCapabilities {
  chat: boolean; fileManagement: boolean; tasks: boolean; git: boolean;
  liveStreaming: boolean; diagnostics: boolean; cancelTasks: boolean; fileDiff: boolean;
}

export interface AgentStatus {
  status: AgentConnectionStatus;
  version?: string; model?: string; workspace?: string;
}

export interface AgentPromptRequest {
  prompt: string; files?: string[]; context?: string; taskId?: string;
}

export interface AgentPromptResponse {
  success: boolean; message: string; taskId?: string;
}

export interface AgentTask {
  id: string; title: string; description?: string; status: AgentTaskStatus;
  progress?: number; createdAt: string; startedAt?: string; completedAt?: string;
}

export type AgentTaskStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface AgentFile {
  path: string; name: string; type: "file" | "directory";
  content?: string; extension?: string; size?: number;
}

export interface AgentFileDiff {
  path: string; status: "added" | "modified" | "deleted";
  additions: number; deletions: number; content?: string;
}

export interface AgentLogEntry {
  id: string; level: AgentLogLevel; message: string; timestamp: string; source?: string;
}

export type AgentLogLevel = "info" | "success" | "warning" | "error" | "debug";

export interface AgentDiagnostic {
  id: string; source: string; severity: "info" | "warning" | "error";
  message: string; details?: unknown;
}

export interface AgentGitStatus {
  branch: string; staged: number; changed: number; ahead?: number; behind?: number;
}

export const DEFAULT_CAPABILITIES: AgentCapabilities = {
  chat: true, fileManagement: false, tasks: false, git: false,
  liveStreaming: false, diagnostics: false, cancelTasks: false, fileDiff: false,
};
