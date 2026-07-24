export type PromptTarget =
  | "chat"
  | "editor"
  | "git"
  | "task"
  | "agent";

export interface PromptRequest {
  id: string;

  content: string;

  target: PromptTarget;

  createdAt: string;
}
