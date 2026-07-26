// Generic agent HTTP contract shapes — no specific agent name referenced.

export interface AgentStatusResponse {
  status: "online" | "offline";
  version?: string;
  model?: string;
}

export interface AgentPromptRequest {
  prompt: string;
  files?: string[];
}

export interface AgentPromptResponse {
  success: boolean;
  message: string;
  taskId?: string;
}
