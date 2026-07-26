// ============================================================
// Protocol layer — defines normalized shapes that all
// adapters must convert to/from.  Features only see these.
// ============================================================

export interface NormalizedRequest {
  prompt: string;
  files?: string[];
  context?: string;
  taskId?: string;
}

export interface NormalizedResponse {
  success: boolean;
  message: string;
  taskId?: string;
}

export interface NormalizedStatus {
  status: "online" | "offline" | "unknown";
  version?: string;
  model?: string;
  workspace?: string;
}

export interface NormalizedEvent {
  type: "message" | "file-changed" | "task-updated" | "error" | "log";
  payload: unknown;
  timestamp: string;
}
