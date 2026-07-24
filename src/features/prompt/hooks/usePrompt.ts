import { usePromptStore } from "../store/promptStore";

export function usePrompt() {
  return usePromptStore();
}
