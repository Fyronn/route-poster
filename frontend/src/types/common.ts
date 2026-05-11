export type EntityStatus = "active" | "inactive" | "draft" | "archived";

export type WorkflowStatus =
  | "completed"
  | "pending"
  | "waiting"
  | "rejected"
  | "revision_requested"
  | "approved"
  | "submitted";

export type TransportType =
  | "corporate-shuttle"
  | "school-shuttle"
  | "intercity-bus"
  | "event-transport"
  | "private-transfer";

export type SetupModel = "abc-managed" | "company-managed" | "hybrid";

export type SelectOption<TValue extends string = string> = {
  label: string;
  value: TValue;
  description?: string;
  disabled?: boolean;
  badge?: string;
};
