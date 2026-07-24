import { apiService } from "./api";

export type AiderConnectionStatus =
  | "unknown"
  | "online"
  | "offline";

export interface AiderStatus {
  status: AiderConnectionStatus;

  version?: string;

  model?: string;

  workspace?: string;
}

export interface AiderPromptRequest {
  prompt: string;

  files?: string[];

  context?: string;

  taskId?: string;
}

export interface AiderPromptResponse {
  success: boolean;

  message: string;

  taskId?: string;
}

export interface AiderApplyRequest {
  prompt: string;

  files?: string[];

  autoCommit?: boolean;
}

export interface AiderApplyResponse {
  success: boolean;

  message: string;

  modifiedFiles?: string[];
}

export interface AiderCancelResponse {
  success: boolean;

  taskId: string;
}

export class AiderService {
  async getStatus() {
    return apiService.get<AiderStatus>(
      "/aider/status",
    );
  }

  async sendPrompt(
    payload: AiderPromptRequest,
  ) {
    return apiService.post<AiderPromptResponse>(
      "/aider/chat",
      payload,
    );
  }

  async applyChanges(
    payload: AiderApplyRequest,
  ) {
    return apiService.post<AiderApplyResponse>(
      "/aider/apply",
      payload,
    );
  }

  async cancelTask(
    taskId: string,
  ) {
    return apiService.post<AiderCancelResponse>(
      `/aider/tasks/${taskId}/cancel`,
      {},
    );
  }

  async healthCheck() {
    try {
      const response =
        await this.getStatus();

      return (
        response.success === true
      );
    } catch {
      return false;
    }
  }
}

export const aiderService =
  new AiderService();
