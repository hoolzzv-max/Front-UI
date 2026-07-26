// ============================================================
// CurrentAgentAdapter — wraps the configured HTTP backend.
// This is the ONLY file that knows about the backend's API shape.
// ============================================================

import type { IAgentAdapter } from "../../core/adapter";
import type {
  AgentStatus,
  AgentInstruction,
  AgentResponse,
  AgentCancelResult,
  AgentCapabilities,
  AgentConnectionConfig,
} from "../../core/types";
import { HttpTransport } from "../../transport/HttpTransport";

export class CurrentAgentAdapter implements IAgentAdapter {
  readonly id = "current";
  private transport: HttpTransport;
  private repoId: string | null = null;

  constructor() {
    this.transport = new HttpTransport({
      baseUrl: import.meta.env.VITE_AGENT_API_URL ?? "",
      token: import.meta.env.VITE_AGENT_API_TOKEN ?? undefined,
    });
  }

  configure(config: AgentConnectionConfig): void {
    this.transport.configure({
      baseUrl: config.apiUrl,
      token: config.token,
    });
    // Reset repo context when config changes
    this.repoId = null;
  }

  async getStatus(): Promise<AgentStatus> {
    try {
      const health = await this.transport.request<{ status: string }>("/health");
      const version = await this.transport.request<{ version?: string }>("/version").catch(() => ({})) as { version?: string };
      return {
        status: health?.status === "ok" ? "online" : "offline",
        version: version?.version,
      };
    } catch {
      return { status: "offline" };
    }
  }

  async sendInstruction(instruction: AgentInstruction): Promise<AgentResponse> {
    // Ensure a repository context exists
    if (!this.repoId) {
      const repo = await this.transport.request<{ id: string }>("/repositories", {
        method: "POST",
        body: {
          url: instruction.context ?? "https://github.com/user/repo",
          branch: "main",
        },
      });
      this.repoId = repo.id;
    }

    const job = await this.transport.request<{ id: string }>("/jobs", {
      method: "POST",
      body: {
        repository_id: this.repoId,
        message: instruction.prompt,
      },
    });

    return {
      success: true,
      message: `Job started: ${job.id}`,
      taskId: job.id,
    };
  }

  async cancelTask(taskId: string): Promise<AgentCancelResult> {
    const res = await this.transport.request<{ job_id: string }>(`/jobs/${taskId}/cancel`, {
      method: "POST",
    });
    return { success: true, taskId: res.job_id };
  }

  async getTaskLogs(taskId: string): Promise<string> {
    const res = await this.transport.request<{ logs: string }>(`/jobs/${taskId}/logs`);
    return res.logs ?? "";
  }

  getCapabilities(): AgentCapabilities {
    return {
      streaming: false,
      fileSystem: false,
      git: false,
      tasks: true,
      diagnostics: false,
    };
  }
}
