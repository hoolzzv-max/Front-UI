import { useConsoleStore } from "../store/consoleStore";

export function useConsole() {
  return useConsoleStore();
}
