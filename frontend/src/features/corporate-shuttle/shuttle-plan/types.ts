import type { CorporateRouteRequest } from "../route-requests/types";

export type ShuttlePlanSummary = {
  clientName: string;
  managerName: string;
  employeeCount: number;
  stopCount: number;
  routeRequestCount: number;
  submittedAt?: string;
  status: "draft" | "submitted" | "approved" | "rejected" | "revision_requested";
  routes: CorporateRouteRequest[];
};
