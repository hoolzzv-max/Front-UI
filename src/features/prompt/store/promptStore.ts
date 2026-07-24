import { create } from "zustand";
import type {
  PromptRequest,
  PromptTarget,
} from "../types";

type PromptState = {
  value: string;

  target: PromptTarget;

  history: PromptRequest[];

  setValue: (value: string) => void;

  setTarget: (
    target: PromptTarget,
  ) => void;

  clear: () => void;

  submit: () => PromptRequest | null;
};

function createId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

export const usePromptStore =
  create<PromptState>((set, get) => ({
    value: "",

    target: "chat",

    history: [],

    setValue: (value) => {
      set({ value });
    },

    setTarget: (target) => {
      set({ target });
    },

    clear: () => {
      set({ value: "" });
    },

    submit: () => {
      const state = get();

      const content =
        state.value.trim();

      if (!content) {
        return null;
      }

      const request: PromptRequest = {
        id: createId(),
        content,
        target: state.target,
        createdAt:
          new Date().toISOString(),
      };

      set({
        value: "",
        history: [
          request,
          ...state.history,
        ],
      });

      return request;
    },
  }));
