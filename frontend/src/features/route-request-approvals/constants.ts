import { corporateRouteRequestsMockData } from "@/features/corporate-shuttle/route-requests/constants";

import type { RouteRequestApproval } from "./types";

export const routeRequestApprovalsMockData: RouteRequestApproval[] =
  corporateRouteRequestsMockData.map((request, index) => ({
    ...request,
    id: request.routeRequestId,
    routeName: request.requestName || "İsimsiz",
    requestedBy: index % 2 === 0 ? "Jane Wilson" : "Mert Kaya",
    vehicleSuggestion:
      request.employeeCount && request.employeeCount > 25
        ? "Midibus / Otobus (35+)"
        : "Minibus (16-19)",
    decisionNote:
      request.status === "revision_requested"
        ? "Durak sayisi cok fazla, bolunmesi gerekir."
        : undefined,
  }));
