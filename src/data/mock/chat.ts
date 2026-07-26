import type { Message } from "../../types/message";

export const MOCK_MESSAGES: Message[] = [
  { id: "1", role: "assistant", content: "Workspace initialized.", status: "completed", createdAt: new Date().toISOString() },
];
