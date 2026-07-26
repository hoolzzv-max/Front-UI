import type { Message } from "../../types/message";

export const MOCK_MESSAGES: Message[] = [
  { id: "msg-1", role: "assistant", content: "Welcome to AI Development Workspace.", status: "completed", createdAt: new Date().toISOString() },
  { id: "msg-2", role: "user", content: "Create a React dashboard with authentication.", status: "completed", createdAt: new Date().toISOString() },
  { id: "msg-3", role: "assistant", content: "I can help design the architecture, routes, stores, and UI structure.", status: "completed", createdAt: new Date().toISOString() },
];
