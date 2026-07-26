import type { AgentAdapter } from "../../core/AgentAdapter";
import type { AgentEventEmitter } from "../../core/AgentService/types";
import type {
  AgentConnectionConfig,
  AgentCapabilities,
  AgentStatus,
  AgentPromptRequest,
  AgentPromptResponse,
} from "../../core/AgentTypes";

export class MockAgentAdapter implements AgentAdapter {
  readonly id = "mock";
  readonly displayName = "Mock Agent (Dev)";
  readonly capabilities: AgentCapabilities = {
    chat: true,
    fileManagement: true,
    tasks: true,
    git: true,
    liveStreaming: false,
    diagnostics: true,
    cancelTasks: true,
    fileDiff: true,
  };

  private connected = false;
  private status: AgentStatus = { status: "disconnected" };

  async connect(_config: AgentConnectionConfig): Promise<void> {
    this.connected = true;
    this.status = { status: "connected", version: "mock-1.0", model: "mock-model" };
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.status = { status: "disconnected" };
  }

  async testConnection(_config: AgentConnectionConfig): Promise<AgentStatus> {
    return { status: "connected", version: "mock-1.0", model: "mock-model" };
  }

  getStatus(): AgentStatus {
    return this.status;
  }

  async sendPrompt(
    payload: AgentPromptRequest,
    emit: AgentEventEmitter,
  ): Promise<AgentPromptResponse> {
    const taskId = `mock-${Date.now()}`;
    emit("agent:task-created", { taskId, title: payload.prompt.slice(0, 60) });
    emit("agent:message", {
      taskId,
      content: `[Mock] Processing: ${payload.prompt}`,
      role: "assistant",
    });

    return {
      success: true,
      message: `Mock job started: ${taskId}`,
      taskId,
    };
  }

  async cancelTask(_taskId: string): Promise<boolean> {
    return true;
  }
}

export const mockAgentAdapter = new MockAgentAdapter();
