// ============================================================
// Generic Agent Events — no specific agent name referenced.
// ============================================================

export type AgentEventMap = {
  /** Agent sent a text message/response */
  "agent:message": {
    taskId?: string;
    content: string;
  };

  /** Agent reports a change to one or more files */
  "agent:files-changed": {
    files: string[];
  };

  /** Agent task status update */
  "agent:task-updated": {
    taskId: string;
    status: string;
    progress?: number;
  };

  /** Agent encountered an error */
  "agent:error": {
    message: string;
    code?: string;
    recoverable?: boolean;
  };

  /** Agent connection status changed */
  "agent:status-changed": {
    status: "unknown" | "online" | "offline";
    version?: string;
  };

  /** Agent log line emitted */
  "agent:log": {
    level: "info" | "warn" | "error" | "debug";
    message: string;
    taskId?: string;
  };
};
