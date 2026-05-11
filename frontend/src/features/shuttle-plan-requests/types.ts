export type ShuttlePlanRequest = {
  id: number;
  clientName: string;
  submittedBy: string;
  submittedAt: string;
  employeeCount: number;
  stopCount: number;
  routeCount: number;
  summary: string;
  status: "submitted" | "approved" | "rejected" | "revision_requested";
};
