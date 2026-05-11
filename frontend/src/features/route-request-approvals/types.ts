import type { CorporateRouteRequest } from "@/features/corporate-shuttle/route-requests/types";

export type RouteRequestApproval = CorporateRouteRequest & {
  requestedBy: string;
  vehicleSuggestion: string;
  decisionNote?: string;
};
