// ============================================================
// AgentRuntime — thin wrapper over agentService for feature use.
// Replaces the previous agent-specific runtime.
// ============================================================

import { agentService } from "../agents";

export class AgentRuntime {
  async sendInstruction(prompt: string) {
    return agentService.sendInstruction({ prompt });
  }

  async healthCheck() {
    return agentService.getStatus();
  }

  getCapabilities() {
    return agentService.getCapabilities();
  }
}

export const agentRuntime = new AgentRuntime();
