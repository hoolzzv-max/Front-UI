import type { NormalizedResponse, NormalizedStatus } from "./types";
import type { AgentResponse, AgentStatus } from "../core/types";

/** Convert a normalized response to AgentResponse for the service layer */
export function normalizeResponse(raw: NormalizedResponse): AgentResponse {
  return {
    success: raw.success,
    message: raw.message ?? "",
    taskId: raw.taskId,
  };
}

/** Convert a normalized status to AgentStatus for the service layer */
export function normalizeStatus(raw: NormalizedStatus): AgentStatus {
  return {
    status: raw.status === "online" ? "online" : "offline",
    version: raw.version,
    model: raw.model,
    workspace: raw.workspace,
  };
}
