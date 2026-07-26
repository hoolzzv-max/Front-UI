import { httpTransport } from "../../transport";
import {
  normalizeStatus,
  normalizePromptResponse,
} from "../../protocol";
import type { AgentAdapter } from "../../core/AgentAdapter";
import type { AgentEventEmitter } from "../../core/AgentService/types";
import type {
  AgentConnectionConfig,
  AgentCapabilities,
  AgentStatus,
  AgentPromptRequest,
  AgentPromptResponse,
} from "../../core/AgentTypes";

export class CurrentAgentAdapter implements AgentAdapter {
  readonly id = "current";
  readonly displayName = "Agent";
  readonly capabilities: AgentCapabilities = {
    chat: true,
    fileManagement: false,
    tasks: true,
    git: false,
    liveStreaming: false,
    diagnostics: false,
    cancelTasks: true,
    fileDiff: false,
  };

  private config: AgentConnectionConfig | null = null;
  private currentRepoId: string | null = null;
  private status: AgentStatus = { status: "disconnected" };

  async connect(config: AgentConnectionConfig): Promise<void> {
    this.config = config;
    await httpTransport.connect(config.apiUrl);
    if (config.token) {
      httpTransport.setToken(config.token);
    }
    this.status = { status: "connected" };
  }

  async disconnect(): Promise<void> {
    await httpTransport.disconnect();
    this.currentRepoId = null;
    this.status = { status: "disconnected" };
  }

  async testConnection(config: AgentConnectionConfig): Promise<AgentStatus> {
    try {
      await httpTransport.connect(config.apiUrl);
      if (config.token) {
        httpTransport.setToken(config.token);
      }

      const health = await httpTransport.request<{ status: string }>("GET", "/health");
      let version: string | undefined;

      try {
        const versionResp = await httpTransport.request<{ version?: string; aider_version?: string }>(
          "GET",
          "/version",
        );
        version = versionResp.version ?? versionResp.aider_version;
      } catch {
        // version endpoint is optional
      }

      const status = normalizeStatus(health);
      return {
        ...status,
        version,
        status: health.status === "ok" ? "connected" : "error",
      };
    } catch {
      return { status: "error" };
    }
  }

  getStatus(): AgentStatus {
    return this.status;
  }

  async sendPrompt(
    payload: AgentPromptRequest,
    emit: AgentEventEmitter,
  ): Promise<AgentPromptResponse> {
    if (!this.config) {
      throw new Error("Adapter not connected.");
    }

    if (!this.currentRepoId) {
      const repo = await httpTransport.request<{ id: string }>(
        "POST",
        "/repositories",
        {
          url: payload.context ?? "https://github.com/user/repo",
          branch: "main",
        },
      );
      this.currentRepoId = repo.id;
    }

    const job = await httpTransport.request<{ id: string }>("POST", "/jobs", {
      repository_id: this.currentRepoId,
      message: payload.prompt,
    });

    emit("agent:task-created", { taskId: job.id, title: payload.prompt.slice(0, 60) });

    return normalizePromptResponse({
      success: true,
      message: `Job started: ${job.id}`,
      taskId: job.id,
    });
  }

  async cancelTask(taskId: string): Promise<boolean> {
    try {
      await httpTransport.request<{ message: string; job_id: string }>(
        "POST",
        `/jobs/${taskId}/cancel`,
      );
      return true;
    } catch {
      return false;
    }
  }
}

export const currentAgentAdapter = new CurrentAgentAdapter();
