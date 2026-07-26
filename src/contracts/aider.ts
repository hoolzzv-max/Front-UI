export interface AgentPromptRequest {
  prompt: string;
  files?: string[];
  context?: string;
  taskId?: string;
}

export interface AgentPromptResponse {
  success: boolean;
  message: string;
  taskId?: string;
}

export interface AgentStatusResponse {
  status: "online" | "offline";
  version?: string;
  model?: string;
}
