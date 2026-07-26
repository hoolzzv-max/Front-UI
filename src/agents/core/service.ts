// ============================================================
// AgentService — single entry point for all features.
// Features NEVER call adapters or transports directly.
// ============================================================

import { agentRegistry } from "./registry";
import { eventBus } from "../../core/events/EventBus";
import type {
  AgentStatus,
  AgentInstruction,
  AgentResponse,
  AgentCancelResult,
  AgentCapabilities,
  AgentConnectionConfig,
} from "./types";

class AgentService {
  /** Configure the active adapter with new connection settings */
  configure(config: AgentConnectionConfig): void {
    agentRegistry.getActive().configure(config);
  }

  /** Health-check: returns the current agent status */
  async getStatus(): Promise<AgentStatus> {
    try {
      const status = await agentRegistry.getActive().getStatus();
      await eventBus.emit("agent:status-changed", {
        status: status.status,
        version: status.version,
      }).catch(() => {});
      return status;
    } catch {
      await eventBus.emit("agent:status-changed", { status: "offline" }).catch(() => {});
      return { status: "offline" };
    }
  }

  /** Send an instruction to the agent */
  async sendInstruction(instruction: AgentInstruction): Promise<AgentResponse> {
    try {
      const response = await agentRegistry.getActive().sendInstruction(instruction);
      if (response.taskId) {
        await eventBus.emit("agent:task-updated", {
          taskId: response.taskId,
          status: "started",
        }).catch(() => {});
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Instruction failed.";
      await eventBus.emit("agent:error", { message, recoverable: true }).catch(() => {});
      throw error;
    }
  }

  /** Cancel a running task */
  async cancelTask(taskId: string): Promise<AgentCancelResult> {
    return agentRegistry.getActive().cancelTask(taskId);
  }

  /** Get log output for a task */
  async getTaskLogs(taskId: string): Promise<string> {
    return agentRegistry.getActive().getTaskLogs(taskId);
  }

  /** Return active adapter capabilities */
  getCapabilities(): AgentCapabilities {
    return agentRegistry.getActive().getCapabilities();
  }

  /** Subscribe to streaming agent events (if adapter supports it) */
  subscribe(handler: (event: { type: string; payload: unknown }) => void): () => void {
    const adapter = agentRegistry.getActive();
    if (adapter.subscribe) {
      return adapter.subscribe(handler);
    }
    return () => {};
  }

  /** Test connectivity — emits agent:status-changed */
  async testConnection(): Promise<boolean> {
    const status = await this.getStatus();
    return status.status === "online";
  }

  /** Switch to a different registered adapter by id */
  switchAdapter(id: string): void {
    agentRegistry.setActive(id);
  }

  /** Get the id of the currently active adapter */
  getActiveAdapterId(): string | null {
    return agentRegistry.getActiveId();
  }

  /** List all registered adapter ids */
  listAdapters(): string[] {
    return agentRegistry.listIds();
  }
}

export const agentService = new AgentService();
