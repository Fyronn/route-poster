export type NotificationType =
  | "warning"
  | "info"
  | "success"
  | "error";

export type Notification = {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: NotificationType;
  isUnread: boolean;
  isUrgent: boolean;
};