import { create } from "zustand";
import type { Message, MessageRole, MessageStatus } from "../../../types/message";
import { agentService } from "@/agents";
import { useLogsStore } from "../../logs/store/logsStore";
import { useConsoleStore } from "../../console/store/consoleStore";

type ChatState = {
  messages: Message[];
  isSubmitting: boolean;
  error: string | null;
  addMessage: (message: Omit<Message, "id" | "createdAt">) => Message;
  updateMessage: (id: string, patch: Partial<Omit<Message, "id">>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  sendMessage: (content: string) => Promise<void>;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() { return new Date().toISOString(); }

function createMessage(params: { role: MessageRole; content: string; status?: MessageStatus }): Message {
  return { id: createId(), role: params.role, content: params.content, status: params.status ?? "completed", createdAt: now() };
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [createMessage({ role: "system", content: "Workspace ready. Connect an agent to begin.", status: "completed" })],
  isSubmitting: false,
  error: null,

  addMessage: (message) => {
    const nextMessage: Message = { ...message, id: createId(), createdAt: now() };
    set((state) => ({ messages: [...state.messages, nextMessage] }));
    return nextMessage;
  },

  updateMessage: (id, patch) => {
    set((state) => ({ messages: state.messages.map((message) => message.id === id ? { ...message, ...patch, updatedAt: now() } : message) }));
  },

  removeMessage: (id) => {
    set((state) => ({ messages: state.messages.filter((message) => message.id !== id) }));
  },

  clearMessages: () => {
    set({ messages: [], error: null, isSubmitting: false });
  },

  sendMessage: async (content) => {
    const cleanContent = content.trim();
    if (!cleanContent) return;
    const { addMessage, updateMessage } = get();
    set({ isSubmitting: true, error: null });
    addMessage({ role: "user", content: cleanContent, status: "completed" });
    const assistantMessage = addMessage({ role: "assistant", content: "", status: "pending" });
    useLogsStore.getState().addLog({ level: "info", message: `Prompt sent to agent` });
    useConsoleStore.getState().appendEntry({ type: "input", content: cleanContent });

    try {
      const response = await agentService.sendPrompt({ prompt: cleanContent });
      const message = response.message ?? "No response received.";
      updateMessage(assistantMessage.id, { status: "completed", content: message });
      useConsoleStore.getState().appendEntry({ type: "output", content: message });
      useLogsStore.getState().addLog({ level: "success", message: "Agent response received." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reach agent.";
      updateMessage(assistantMessage.id, { status: "error", content: message });
      useConsoleStore.getState().appendEntry({ type: "error", content: message });
      useLogsStore.getState().addLog({ level: "error", message });
      set({ isSubmitting: false, error: message });
      return;
    }
    set({ isSubmitting: false });
  },
}));
