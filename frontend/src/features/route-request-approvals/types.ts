import type { CorporateRouteRequest } from "@/features/corporate-shuttle/route-requests/types";

export type RouteRequestApproval = CorporateRouteRequest & {
  id: number;
  routeName: string;
  assignedDriver?: string;
  assignedVehicle?: string;
  requestedBy: string;
  vehicleSuggestion: string;
  decisionNote?: string | null;
};
