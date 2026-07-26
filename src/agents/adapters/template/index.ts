import type { AgentAdapter } from "../../core/AgentAdapter";
import type {
  AgentConnectionConfig,
  AgentCapabilities,
  AgentStatus,
  AgentPromptRequest,
  AgentPromptResponse,
} from "../../core/AgentTypes";
import type { AgentEventEmitter } from "../../core/AgentService/types";

export class TemplateAgentAdapter implements AgentAdapter {
  readonly id = "template";
  readonly displayName = "Template Agent";
  readonly capabilities: AgentCapabilities = {
    chat: false,
    fileManagement: false,
    tasks: false,
    git: false,
    liveStreaming: false,
    diagnostics: false,
    cancelTasks: false,
    fileDiff: false,
  };

  async connect(_config: AgentConnectionConfig): Promise<void> {
    throw new Error("Template adapter not implemented.");
  }

  async disconnect(): Promise<void> {}

  async testConnection(_config: AgentConnectionConfig): Promise<AgentStatus> {
    return { status: "unknown" };
  }

  getStatus(): AgentStatus {
    return { status: "unknown" };
  }

  async sendPrompt(
    _payload: AgentPromptRequest,
    _emit: AgentEventEmitter,
  ): Promise<AgentPromptResponse> {
    throw new Error("Template adapter not implemented.");
  }
}
