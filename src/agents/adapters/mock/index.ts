// ============================================================
// MockAgentAdapter — used during development and testing.
// Never deployed as the active adapter in production.
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

export class MockAgentAdapter implements IAgentAdapter {
  readonly id = "mock";
  private config: AgentConnectionConfig = { apiUrl: "" };

  configure(config: AgentConnectionConfig): void {
    this.config = config;
  }

  async getStatus(): Promise<AgentStatus> {
    return {
      status: "online",
      version: "mock-1.0.0",
      model: "mock-model",
      workspace: "/mock/workspace",
    };
  }

  async sendInstruction(instruction: AgentInstruction): Promise<AgentResponse> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      message: `[Mock] Received: "${instruction.prompt.slice(0, 80)}"`,
      taskId: `mock-${Date.now()}`,
    };
  }

  async cancelTask(taskId: string): Promise<AgentCancelResult> {
    return { success: true, taskId };
  }

  async getTaskLogs(_taskId: string): Promise<string> {
    return "[Mock] No logs available.";
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
