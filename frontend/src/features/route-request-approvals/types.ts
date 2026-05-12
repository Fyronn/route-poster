import type { CorporateRouteRequest } from "@/features/corporate-shuttle/route-requests/types";

export type RouteRequestApproval = CorporateRouteRequest & {
  assignedDriver?: string;
  assignedVehicle?: string;
  requestedBy: string;
  vehicleSuggestion: string;
  decisionNote?: string;
};
