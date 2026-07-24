export type TaskStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface TaskItem {
  id: string;

  title: string;

  description?: string;

  status: TaskStatus;

  priority: TaskPriority;

  progress: number;

  createdAt: string;

  startedAt?: string;

  completedAt?: string;

  error?: string;
}
