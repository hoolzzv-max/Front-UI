import { eventBus } from "@/core/events/EventBus";
import type { AgentAdapter } from "../AgentAdapter";
import type {
  AgentConnectionConfig,
  AgentCapabilities,
  AgentStatus,
  AgentPromptRequest,
  AgentPromptResponse,
  AgentFile,
  AgentFileDiff,
  AgentTask,
  AgentGitStatus,
} from "../AgentTypes";
import type { AgentEventEmitter } from "./types";

export class AgentService {
  private adapter: AgentAdapter | null = null;
  private config: AgentConnectionConfig | null = null;
  private unsubscribeLive: (() => void) | null = null;

  setAdapter(adapter: AgentAdapter) {
    if (this.adapter) {
      void this.adapter.disconnect().catch(() => {});
    }
    if (this.unsubscribeLive) {
      this.unsubscribeLive();
      this.unsubscribeLive = null;
    }
    this.adapter = adapter;
  }

  getAdapterId(): string {
    return this.adapter?.id ?? "none";
  }

  getDisplayName(): string {
    return this.adapter?.displayName ?? "No Agent";
  }

  getCapabilities(): AgentCapabilities {
    return this.adapter?.capabilities ?? {
      chat: false, fileManagement: false, tasks: false, git: false,
      liveStreaming: false, diagnostics: false, cancelTasks: false, fileDiff: false,
    };
  }

  private emit: AgentEventEmitter = (event, payload) => {
    void eventBus.emit(event as never, payload as never).catch(() => {});
  };

  async connect(config: AgentConnectionConfig): Promise<void> {
    if (!this.adapter) throw new Error("No agent adapter registered.");
    this.config = config;
    await this.adapter.connect(config);
    if (this.adapter.subscribe) {
      this.unsubscribeLive = this.adapter.subscribe(this.emit);
    }
    this.emit("agent:connected", { timestamp: new Date().toISOString() });
  }

  async disconnect(): Promise<void> {
    if (this.unsubscribeLive) { this.unsubscribeLive(); this.unsubscribeLive = null; }
    if (this.adapter) await this.adapter.disconnect();
    this.emit("agent:disconnected", {});
  }

  async testConnection(config: AgentConnectionConfig): Promise<AgentStatus> {
    if (!this.adapter) return { status: "unknown" };
    return this.adapter.testConnection(config);
  }

  getStatus(): AgentStatus {
    return this.adapter?.getStatus() ?? { status: "unknown" };
  }

  async sendPrompt(payload: AgentPromptRequest): Promise<AgentPromptResponse> {
    if (!this.adapter) throw new Error("No agent adapter registered.");
    return this.adapter.sendPrompt(payload, this.emit);
  }

  async cancelTask(taskId: string): Promise<boolean> {
    if (!this.adapter?.cancelTask) return false;
    return this.adapter.cancelTask(taskId);
  }

  async listFiles(): Promise<AgentFile[]> {
    if (!this.adapter?.listFiles) return [];
    return this.adapter.listFiles();
  }

  async readFile(path: string): Promise<string | null> {
    if (!this.adapter?.readFile) return null;
    return this.adapter.readFile(path);
  }

  async saveFile(path: string, content: string): Promise<boolean> {
    if (!this.adapter?.saveFile) return false;
    return this.adapter.saveFile(path, content);
  }

  async getFileDiffs(): Promise<AgentFileDiff[]> {
    if (!this.adapter?.getFileDiffs) return [];
    return this.adapter.getFileDiffs();
  }

  async listTasks(): Promise<AgentTask[]> {
    if (!this.adapter?.listTasks) return [];
    return this.adapter.listTasks();
  }

  async getGitStatus(): Promise<AgentGitStatus | null> {
    if (!this.adapter?.getGitStatus) return null;
    return this.adapter.getGitStatus();
  }
}

export const agentService = new AgentService();
