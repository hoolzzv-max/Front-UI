import { create } from "zustand";
import type { Message, MessageRole, MessageStatus } from "../../../types/message";
import { agentService } from "../../../agents";
import { eventBus } from "../../../core/events/EventBus";

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
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() {
  return new Date().toISOString();
}

function createMessage(params: {
  role: MessageRole;
  content: string;
  status?: MessageStatus;
}): Message {
  return {
    id: createId(),
    role: params.role,
    content: params.content,
    status: params.status ?? "completed",
    createdAt: now(),
  };
}

// Subscribe to agent messages and append them to chat
function initAgentMessageListener(store: () => ChatState) {
  eventBus.on("agent:message", ({ content, taskId }) => {
    const { addMessage, isSubmitting } = store();
    if (isSubmitting) return; // handled inside sendMessage
    addMessage({ role: "assistant", content, status: "completed" });
    void taskId; // used for task tracking externally
  });
}

export const useChatStore = create<ChatState>((set, get) => {
  const state: ChatState = {
    messages: [
      createMessage({
        role: "system",
        content: "Workspace ready. Connect your agent in Settings to start.",
        status: "completed",
      }),
    ],
    isSubmitting: false,
    error: null,

    addMessage: (message) => {
      const nextMessage: Message = { ...message, id: createId(), createdAt: now() };
      set((s) => ({ messages: [...s.messages, nextMessage] }));
      return nextMessage;
    },

    updateMessage: (id, patch) => {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === id ? { ...m, ...patch, updatedAt: now() } : m,
        ),
      }));
    },

    removeMessage: (id) => {
      set((s) => ({ messages: s.messages.filter((m) => m.id !== id) }));
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

      const assistantMessage = addMessage({
        role: "assistant",
        content: "",
        status: "pending",
      });

      try {
        const response = await agentService.sendInstruction({ prompt: cleanContent });

        updateMessage(assistantMessage.id, {
          status: "completed",
          content: response.message,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to reach agent.";
        updateMessage(assistantMessage.id, { status: "error", content: message });
        set({ error: message });
      } finally {
        set({ isSubmitting: false });
      }
    },
  };

  // Wire agent message events to chat (after store is created)
  setTimeout(() => initAgentMessageListener(() => useChatStore.getState()), 0);

  return state;
});
