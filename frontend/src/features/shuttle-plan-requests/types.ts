export type ShuttlePlanRequest = {
  id: number;
  clientName: string;
  submittedBy: string;
  submittedAt: string;
  employeeCount: number;
  stopCount: number;
  routeCount: number;
  summary: string;
  status: "requested" | "approved" | "rejected";
};
