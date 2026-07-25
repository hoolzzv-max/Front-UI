import { apiService } from "./api";
import type { AiderPromptRequest, AiderPromptResponse } from "../contracts";

const API_BASE = "https://aider-production-05b5.up.railway.app";

// تهيئة ApiClient
apiService.configure(API_BASE);
const token = import.meta.env.VITE_AGENT_API_TOKEN;
if (token) apiService.setAuthToken(token);

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
  private currentRepoId: string | null = null;

  async getStatus(): Promise<AiderStatusLocal> {
    try {
      const res = await apiService.get<{ status: string; service: string }>("/health");
      const ver = await apiService.get<{ aider_version: string }>("/version");

      return {
        status: res.data.status === "ok" ? "online" : "offline",
        version: ver.data.aider_version,
        model: "openai/gpt-4o-mini",
        workspace: "/workspace",
      };
    } catch {
      return { status: "offline" };
    }
  }

  async sendPrompt(payload: AiderPromptRequest): Promise<AiderPromptResponse> {
    // إنشاء مستودع إذا لم يكن موجوداً
    if (!this.currentRepoId) {
      const repo = await apiService.post<{ id: string }>("/repositories", {
        url: payload.context || "https://github.com/user/repo",
        branch: "main",
      });
      this.currentRepoId = repo.data.id;
    }

    // إرسال المهمة
    const job = await apiService.post<{ id: string }>("/jobs", {
      repository_id: this.currentRepoId,
      message: payload.prompt,
    });

    return {
      success: true,
      message: `Job started: ${job.data.id}`,
      taskId: job.data.id,
    };
  }

  async applyChanges(payload: AiderApplyRequestLocal): Promise<AiderApplyResponseLocal> {
    if (!this.currentRepoId) {
      const repo = await apiService.post<{ id: string }>("/repositories", {
        url: "https://github.com/user/repo",
        branch: "main",
      });
      this.currentRepoId = repo.data.id;
    }

    const job = await apiService.post<{ id: string }>("/jobs", {
      repository_id: this.currentRepoId,
      message: payload.prompt,
    });

    return {
      success: true,
      message: `Changes applied: ${job.data.id}`,
    };
  }

  async cancelTask(taskId: string): Promise<AiderCancelResponseLocal> {
    const res = await apiService.post<{ message: string; job_id: string }>(
      `/jobs/${taskId}/cancel`
    );
    return {
      success: true,
      taskId: res.data.job_id,
    };
  }

  async getJobLogs(jobId: string): Promise<string> {
    const res = await apiService.get<{ logs: string }>(`/jobs/${jobId}/logs`);
    return res.data.logs;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const status = await this.getStatus();
      return status.status === "online";
    } catch {
      return false;
    }
  }
}

export const aiderService = new AiderService();
