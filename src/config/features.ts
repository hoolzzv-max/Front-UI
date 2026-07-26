export const FEATURE_FLAGS = {
  chat: true,
  editor: true,
  explorer: true,
  prompt: true,
  terminal: true,
  logs: true,
  diagnostics: true,
  git: true,
  tasks: true,
  notifications: true,
  commandPalette: true,

  /** Live agent integration via the transport layer */
  agentIntegration: true,

  /** Streaming via WebSocket/SSE (requires adapter support) */
  agentStreaming: false,

  /** File system operations via agent */
  agentFileSystem: false,
} as const;
