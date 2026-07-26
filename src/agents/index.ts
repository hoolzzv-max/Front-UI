// Agent abstraction layer — public API
export type {
  AgentConnectionConfig, AgentConnectionStatus, AgentCapabilities, AgentStatus,
  AgentPromptRequest, AgentPromptResponse, AgentTask, AgentTaskStatus,
  AgentFile, AgentFileDiff, AgentLogEntry, AgentLogLevel, AgentDiagnostic,
  AgentGitStatus, AgentTransportType, DEFAULT_CAPABILITIES,
} from "./core/AgentTypes";

export type { AgentEventMap } from "./core/AgentEvents";
export type { AgentAdapter } from "./core/AgentAdapter";
export type { AgentEventEmitter } from "./core/AgentService/types";

export { agentService, AgentService } from "./core/AgentService";
export { agentRegistry, AgentRegistry } from "./core/AgentRegistry";

export {
  httpTransport, HttpTransport, webSocketTransport, WebSocketTransport,
  sseTransport, SseTransport,
} from "./transport";
export type {
  Transport, RequestTransport, StreamTransport, TransportOptions, RequestTransportOptions,
} from "./transport";

export {
  normalizeStatus, normalizePromptRequest, normalizePromptResponse,
  normalizeFile, normalizeFileList, normalizeFileDiff, normalizeTaskStatus,
  normalizeTask, normalizeTaskList, normalizeLogLevel, normalizeLogEntry,
  normalizeDiagnostic, normalizeGitStatus,
} from "./protocol";

export {
  currentAgentAdapter, mockAgentAdapter, TemplateAgentAdapter,
} from "./adapters";
