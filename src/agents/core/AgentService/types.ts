import type { AgentEventMap } from "../AgentEvents";
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

export type AgentEventEmitter = <K extends keyof AgentEventMap>(
  event: K,
  payload: AgentEventMap[K],
) => void;
