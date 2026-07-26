// ============================================================
// IAgentAdapter — interface every adapter must implement.
// Adapters are the only layer that knows agent-specific details.
// ============================================================

import type {
  AgentStatus,
  AgentInstruction,
  AgentResponse,
  AgentCancelResult,
  AgentCapabilities,
  AgentConnectionConfig,
} from "./types";

export interface IAgentAdapter {
  /** Human-readable adapter identifier (used only for logging/registry) */
  readonly id: string;

  /** Apply connection settings */
  configure(config: AgentConnectionConfig): void;

  /** Check if the backend is reachable */
  getStatus(): Promise<AgentStatus>;

  /** Send an instruction and return a job/task response */
  sendInstruction(instruction: AgentInstruction): Promise<AgentResponse>;

  /** Cancel a running task */
  cancelTask(taskId: string): Promise<AgentCancelResult>;

  /** Fetch log output for a task */
  getTaskLogs(taskId: string): Promise<string>;

  /** Return the static capabilities of this adapter */
  getCapabilities(): AgentCapabilities;

  /** Optional: subscribe to streaming events. Unsubscribe fn returned. */
  subscribe?(handler: (event: { type: string; payload: unknown }) => void): () => void;
}
