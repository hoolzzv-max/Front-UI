export type TaskStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface Task {
  id: string;

  title: string;

  description?: string;

  status: TaskStatus;

  createdAt: string;

  startedAt?: string;

  completedAt?: string;
}
