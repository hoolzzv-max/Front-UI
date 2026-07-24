import { create } from "zustand";
import type {
  TaskItem,
  TaskPriority,
  TaskStatus,
} from "../types";

type TasksState = {
  tasks: TaskItem[];

  createTask: (
    title: string,
    priority?: TaskPriority,
    description?: string,
  ) => TaskItem;

  updateTaskStatus: (
    taskId: string,
    status: TaskStatus,
  ) => void;

  updateTaskProgress: (
    taskId: string,
    progress: number,
  ) => void;

  removeTask: (
    taskId: string,
  ) => void;

  clearCompleted: () => void;

  getActiveTasks: () => TaskItem[];
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

function now() {
  return new Date().toISOString();
}

export const useTasksStore =
  create<TasksState>((set, get) => ({
    tasks: [
      {
        id: createId(),
        title: "Initialize Workspace",
        status: "completed",
        priority: "medium",
        progress: 100,
        createdAt: now(),
        completedAt: now(),
      },
    ],

    createTask: (
      title,
      priority = "medium",
      description,
    ) => {
      const task: TaskItem = {
        id: createId(),
        title,
        description,
        priority,
        status: "pending",
        progress: 0,
        createdAt: now(),
      };

      set((state) => ({
        tasks: [task, ...state.tasks],
      }));

      return task;
    },

    updateTaskStatus: (
      taskId,
      status,
    ) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status,
                startedAt:
                  status === "running"
                    ? now()
                    : task.startedAt,
                completedAt:
                  status === "completed" ||
                  status === "failed" ||
                  status === "cancelled"
                    ? now()
                    : task.completedAt,
              }
            : task,
        ),
      }));
    },

    updateTaskProgress: (
      taskId,
      progress,
    ) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                progress,
              }
            : task,
        ),
      }));
    },

    removeTask: (taskId) => {
      set((state) => ({
        tasks: state.tasks.filter(
          (task) => task.id !== taskId,
        ),
      }));
    },

    clearCompleted: () => {
      set((state) => ({
        tasks: state.tasks.filter(
          (task) =>
            task.status !==
            "completed",
        ),
      }));
    },

    getActiveTasks: () => {
      return get().tasks.filter(
        (task) =>
          task.status === "running" ||
          task.status === "queued" ||
          task.status === "pending",
      );
    },
  }));
