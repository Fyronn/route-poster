import { corporateRouteRequestsMockData } from "@/features/corporate-shuttle/route-requests/constants";

import type { RouteRequestApproval } from "./types";

export const routeRequestApprovalsMockData: RouteRequestApproval[] =
  corporateRouteRequestsMockData.map((request, index) => ({
    ...request,
    requestedBy: index % 2 === 0 ? "Jane Wilson" : "Mert Kaya",
    vehicleSuggestion:
      request.employeeCount > 45 ? "2 midibus veya 1 büyük otobüs" : "1 midibus",
    decisionNote:
      request.status === "revision_requested"
        ? "Durak sıralaması ve başlangıç saati revize edilmeli."
        : undefined,
  }));
