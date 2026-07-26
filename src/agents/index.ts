// ============================================================
// Public surface of the agents layer.
// Features import from here — never from sub-paths.
// ============================================================

export { agentService } from "./core/service";
export { agentRegistry } from "./core/registry";
export type { IAgentAdapter } from "./core/adapter";
export type {
  AgentStatus,
  AgentInstruction,
  AgentResponse,
  AgentCancelResult,
  AgentCapabilities,
  AgentConnectionConfig,
  AgentConnectionStatus,
  AgentTransportType,
} from "./core/types";
export type { AgentEventMap } from "./core/events";
