export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: NotificationType;
  createdAt: string;
  unread: boolean;
}
