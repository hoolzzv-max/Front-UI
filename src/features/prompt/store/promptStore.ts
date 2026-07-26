import { create } from "zustand";
import type { PromptRequest, PromptTarget } from "../types";
import { agentService } from "@/agents";
import { useChatStore } from "../../chat/store/chatStore";
import { useLogsStore } from "../../logs/store/logsStore";
import { useConsoleStore } from "../../console/store/consoleStore";

type PromptState = {
  value: string;
  target: PromptTarget;
  history: PromptRequest[];

  setValue: (value: string) => void;
  setTarget: (target: PromptTarget) => void;
  clear: () => void;
  submit: () => PromptRequest | null;
  sendToAgent: () => Promise<void>;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  value: "",
  target: "chat",
  history: [],

  setValue: (value) => set({ value }),

  setTarget: (target) => set({ target }),

  clear: () => set({ value: "" }),

  submit: () => {
    const state = get();
    const content = state.value.trim();
    if (!content) return null;

    const request: PromptRequest = {
      id: createId(),
      content,
      target: state.target,
      createdAt: new Date().toISOString(),
    };

    set({ value: "", history: [request, ...state.history] });
    return request;
  },

  sendToAgent: async () => {
    const state = get();
    const prompt = state.value.trim();
    if (!prompt) return;

    const chatStore = useChatStore.getState();
    const logsStore = useLogsStore.getState();
    const consoleStore = useConsoleStore.getState();

    chatStore.addMessage({ role: "user", content: prompt, status: "completed" });
    logsStore.addLog({ level: "info", message: "Prompt sent to agent" });
    consoleStore.appendEntry({ type: "input", content: prompt });

    set({ value: "" });

    try {
      const response = await agentService.sendPrompt({ prompt });
      const message = response.message ?? "No response received.";

      chatStore.addMessage({ role: "assistant", content: message, status: "completed" });
      consoleStore.appendEntry({ type: "output", content: message });
      logsStore.addLog({ level: "success", message: "Agent response received." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reach agent.";

      chatStore.addMessage({ role: "assistant", content: message, status: "error" });
      consoleStore.appendEntry({ type: "error", content: message });
      logsStore.addLog({ level: "error", message });
    }
  },
}));
