export type ChangeRequestStatus = "pending" | "approved" | "rejected";

export type ChangeRequestPriority = "medium priority" | "high priority";

export type ChangeRequest = {
  id: string;
  clientName: string;
  routeName: string;
  requestType: string;
  description: string;
  requestedBy: string;
  date: string;
  priority: ChangeRequestPriority;
  status: ChangeRequestStatus;
};