// ============================================================
// TemplateAgentAdapter — copy this to add a new agent backend.
//
// Steps:
//   1. cp -r src/agents/adapters/template src/agents/adapters/my-agent
//   2. Set `id` to a unique string
//   3. Implement each method against your backend's API
//   4. Register in src/bootstrap/registerAgents.ts
//   5. No feature files need to change — only this adapter.
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

export class TemplateAgentAdapter implements IAgentAdapter {
  readonly id = "template";

  configure(_config: AgentConnectionConfig): void {
    // TODO: store config and apply to transport
  }

  async getStatus(): Promise<AgentStatus> {
    // TODO: call your backend's health endpoint
    return { status: "offline" };
  }

  async sendInstruction(_instruction: AgentInstruction): Promise<AgentResponse> {
    // TODO: call your backend's instruction/job endpoint
    throw new Error("TemplateAgentAdapter.sendInstruction not implemented.");
  }

  async cancelTask(taskId: string): Promise<AgentCancelResult> {
    // TODO: call your backend's cancel endpoint
    throw new Error("TemplateAgentAdapter.cancelTask not implemented.");
  }

  async getTaskLogs(_taskId: string): Promise<string> {
    // TODO: call your backend's logs endpoint
    return "";
  }

  getCapabilities(): AgentCapabilities {
    return {
      streaming: false,
      fileSystem: false,
      git: false,
      tasks: false,
      diagnostics: false,
    };
  }
}
