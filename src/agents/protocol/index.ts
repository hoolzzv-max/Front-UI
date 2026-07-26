import type {
  AgentPromptRequest, AgentPromptResponse, AgentStatus, AgentConnectionStatus,
  AgentFile, AgentFileDiff, AgentTask, AgentTaskStatus,
  AgentLogEntry, AgentLogLevel, AgentDiagnostic, AgentGitStatus,
} from "../core/AgentTypes";

export function normalizeStatus(raw: unknown, fallback: AgentConnectionStatus = "unknown"): AgentStatus {
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    const rawStatus = obj.status;
    let status: AgentConnectionStatus = fallback;
    if (typeof rawStatus === "string") {
      if (rawStatus === "ok" || rawStatus === "online" || rawStatus === "connected") status = "connected";
      else if (rawStatus === "offline" || rawStatus === "disconnected") status = "disconnected";
      else if (rawStatus === "connecting" || rawStatus === "reconnecting") status = rawStatus as AgentConnectionStatus;
      else if (rawStatus === "error" || rawStatus === "failed") status = "error";
    }
    return {
      status,
      version: typeof obj.version === "string" ? obj.version : undefined,
      model: typeof obj.model === "string" ? obj.model : undefined,
      workspace: typeof obj.workspace === "string" ? obj.workspace : undefined,
    };
  }
  return { status: fallback };
}

export function normalizePromptRequest(prompt: string, options?: { files?: string[]; context?: string; taskId?: string }): AgentPromptRequest {
  return { prompt, files: options?.files, context: options?.context, taskId: options?.taskId };
}

export function normalizePromptResponse(raw: unknown): AgentPromptResponse {
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    return {
      success: typeof obj.success === "boolean" ? obj.success : true,
      message: typeof obj.message === "string" ? obj.message : "Task started.",
      taskId: typeof obj.taskId === "string" ? obj.taskId : typeof obj.id === "string" ? obj.id : undefined,
    };
  }
  return { success: false, message: "Invalid response from agent." };
}

export function normalizeFile(raw: unknown): AgentFile | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const path = typeof obj.path === "string" ? obj.path : typeof obj.name === "string" ? obj.name : "";
  if (!path) return null;
  return {
    path,
    name: typeof obj.name === "string" ? obj.name : path.split("/").pop() ?? path,
    type: obj.type === "directory" ? "directory" : "file",
    content: typeof obj.content === "string" ? obj.content : undefined,
    extension: typeof obj.extension === "string" ? obj.extension : path.includes(".") ? path.split(".").pop() : undefined,
    size: typeof obj.size === "number" ? obj.size : undefined,
  };
}

export function normalizeFileList(raw: unknown): AgentFile[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeFile).filter((f): f is AgentFile => f !== null);
}

export function normalizeFileDiff(raw: unknown): AgentFileDiff | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const path = typeof obj.path === "string" ? obj.path : "";
  if (!path) return null;
  const statusRaw = typeof obj.status === "string" ? obj.status : "modified";
  return {
    path,
    status: statusRaw === "added" || statusRaw === "deleted" ? statusRaw : "modified",
    additions: typeof obj.additions === "number" ? obj.additions : 0,
    deletions: typeof obj.deletions === "number" ? obj.deletions : 0,
    content: typeof obj.content === "string" ? obj.content : undefined,
  };
}

export function normalizeTaskStatus(raw: unknown): AgentTaskStatus {
  if (typeof raw !== "string") return "pending";
  if (raw === "running" || raw === "completed" || raw === "failed" || raw === "cancelled") return raw;
  return "pending";
}

export function normalizeTask(raw: unknown): AgentTask | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const id = typeof obj.id === "string" ? obj.id : "";
  if (!id) return null;
  return {
    id,
    title: typeof obj.title === "string" ? obj.title : "Untitled task",
    description: typeof obj.description === "string" ? obj.description : undefined,
    status: normalizeTaskStatus(obj.status),
    progress: typeof obj.progress === "number" ? obj.progress : undefined,
    createdAt: typeof obj.createdAt === "string" ? obj.createdAt : new Date().toISOString(),
    startedAt: typeof obj.startedAt === "string" ? obj.startedAt : undefined,
    completedAt: typeof obj.completedAt === "string" ? obj.completedAt : undefined,
  };
}

export function normalizeTaskList(raw: unknown): AgentTask[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeTask).filter((t): t is AgentTask => t !== null);
}

export function normalizeLogLevel(raw: unknown): AgentLogLevel {
  if (typeof raw !== "string") return "info";
  if (raw === "success" || raw === "warning" || raw === "error" || raw === "debug") return raw;
  return "info";
}

export function normalizeLogEntry(raw: unknown): AgentLogEntry | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const id = typeof obj.id === "string" ? obj.id : crypto.randomUUID();
  return {
    id,
    level: normalizeLogLevel(obj.level),
    message: typeof obj.message === "string" ? obj.message : "",
    timestamp: typeof obj.timestamp === "string" ? obj.timestamp : new Date().toISOString(),
    source: typeof obj.source === "string" ? obj.source : undefined,
  };
}

export function normalizeDiagnostic(raw: unknown): AgentDiagnostic | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const id = typeof obj.id === "string" ? obj.id : crypto.randomUUID();
  const severityRaw = typeof obj.severity === "string" ? obj.severity : "info";
  return {
    id,
    source: typeof obj.source === "string" ? obj.source : "agent",
    severity: severityRaw === "warning" || severityRaw === "error" ? severityRaw : "info",
    message: typeof obj.message === "string" ? obj.message : "",
    details: obj.details,
  };
}

export function normalizeGitStatus(raw: unknown): AgentGitStatus | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const branch = typeof obj.branch === "string" ? obj.branch : "main";
  return {
    branch,
    staged: typeof obj.staged === "number" ? obj.staged : 0,
    changed: typeof obj.changed === "number" ? obj.changed : 0,
    ahead: typeof obj.ahead === "number" ? obj.ahead : undefined,
    behind: typeof obj.behind === "number" ? obj.behind : undefined,
  };
}
