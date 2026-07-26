export const FEATURE_FLAGS = {
  chat: true, editor: true, explorer: true, prompt: true, terminal: true,
  logs: true, diagnostics: true, git: true, tasks: true, notifications: true,
  commandPalette: true, agentIntegration: true, backendIntegration: true,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
