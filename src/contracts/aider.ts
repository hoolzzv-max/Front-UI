export interface AiderStatusResponse {
  status: "online" | "offline";

  version?: string;

  model?: string;
}

export interface AiderPromptRequest {
  prompt: string;

  files?: string[];
}

export interface AiderPromptResponse {
  success: boolean;

  message: string;

  taskId?: string;
}
