import type {
  AgentConnectionStatus,
  AgentFileDiff,
  AgentLogEntry,
  AgentDiagnostic,
} from "../AgentTypes";

export interface AgentEventMap {
  "agent:status": { status: AgentConnectionStatus; url?: string };
  "agent:message": { taskId?: string; content: string; role: "user" | "assistant" | "system" };
  "agent:files-changed": { files: string[] };
  "agent:file-diff": { diffs: AgentFileDiff[] };
  "agent:task-created": { taskId: string; title: string };
  "agent:task-updated": { taskId: string; status?: string; progress?: number };
  "agent:log": { entry: AgentLogEntry };
  "agent:diagnostic": { diagnostic: AgentDiagnostic };
  "agent:error": { message: string; code?: string; recoverable?: boolean };
  "agent:connected": { timestamp: string };
  "agent:disconnected": { reason?: string };
}
