import { apiService } from "./api";
import type {
  AiderApplyRequest,
  AiderApplyResponse,
  AiderCancelResponse,
  AiderPromptRequest,
  AiderPromptResponse,
  AiderStatus,
} from "../contracts";

export type AiderConnectionStatus = "unknown" | "online" | "offline";

export interface AiderStatusLocal {
  status: AiderConnectionStatus;
  version?: string;
  model?: string;
  workspace?: string;
}

export interface AiderPromptRequestLocal {
  prompt: string;
  files?: string[];
  context?: string;
  taskId?: string;
}

export interface AiderPromptResponseLocal {
  success: boolean;
  message: string;
  taskId?: string;
}

export interface AiderApplyRequestLocal {
  prompt: string;
  files?: string[];
  autoCommit?: boolean;
}

export interface AiderApplyResponseLocal {
  success: boolean;
  message: string;
  modifiedFiles?: string[];
}

export interface AiderCancelResponseLocal {
  success: boolean;
  taskId: string;
}

export class AiderService {
  /**
   * Get the current status of the Aider service
   * @returns Promise with the service status
   */
  async getStatus(): Promise<AiderStatusLocal> {
    return apiService.get<AiderStatusLocal>("/aider/status");
  }

  /**
   * Send a prompt to Aider for processing
   * @param payload - The prompt request payload using the contract types
   * @returns Promise with the prompt response
   */
  async sendPrompt(payload: AiderPromptRequest): Promise<AiderPromptResponse> {
    return apiService.post<AiderPromptResponse>("/aider/chat", payload);
  }

  /**
   * Apply changes using Aider with automatic commit option
   * @param payload - The apply request payload
   * @returns Promise with the apply response
   */
  async applyChanges(payload: AiderApplyRequestLocal): Promise<AiderApplyResponseLocal> {
    return apiService.post<AiderApplyResponseLocal>("/aider/apply", payload);
  }

  /**
   * Cancel a running Aider task
   * @param taskId - The ID of the task to cancel
   * @returns Promise with the cancellation response
   */
  async cancelTask(taskId: string): Promise<AiderCancelResponseLocal> {
    return apiService.post<AiderCancelResponseLocal>(`/aider/tasks/${taskId}/cancel`, {});
  }

  /**
   * Perform a health check on the Aider service
   * @returns Promise with boolean indicating if service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.getStatus();
      return response.success === true;
    } catch {
      return false;
    }
  }
}

export const aiderService = new AiderService();
