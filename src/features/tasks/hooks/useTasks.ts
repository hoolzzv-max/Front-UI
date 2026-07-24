import { useTasksStore } from "../store/tasksStore";

export function useTasks() {
  return useTasksStore();
}
