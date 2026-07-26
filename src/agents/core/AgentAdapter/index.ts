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
import type { AgentEventEmitter } from "../AgentService/types";

export interface AgentAdapter {
  readonly id: string;
  readonly displayName: string;
  readonly capabilities: AgentCapabilities;
  connect(config: AgentConnectionConfig): Promise<void>;
  disconnect(): Promise<void>;
  testConnection(config: AgentConnectionConfig): Promise<AgentStatus>;
  getStatus(): AgentStatus;
  sendPrompt(payload: AgentPromptRequest, emit: AgentEventEmitter): Promise<AgentPromptResponse>;
  cancelTask?(taskId: string): Promise<boolean>;
  listFiles?(): Promise<AgentFile[]>;
  readFile?(path: string): Promise<string>;
  saveFile?(path: string, content: string): Promise<boolean>;
  getFileDiffs?(): Promise<AgentFileDiff[]>;
  listTasks?(): Promise<AgentTask[]>;
  getGitStatus?(): Promise<AgentGitStatus>;
  subscribe?(emit: AgentEventEmitter): () => void;
}
