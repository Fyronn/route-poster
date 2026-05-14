import { getRequest, putRequest } from "@/lib/api";
import type { CorporateRouteRequest } from "@/features/corporate-shuttle/route-requests/types";

import { routeRequestApprovalsMockData } from "../constants";
import type { RouteRequestApproval } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getRouteRequestApprovals(options: ServiceOptions = {}) {
  try {
    const requests = await getRequest<CorporateRouteRequest[]>(
      "/api/shuttle-plan-requests",
      { authToken: options.authToken },
    );
    return requests.map<RouteRequestApproval>((request) => ({
      ...request,
      id: request.routeId,
      routeName: request.routeName || "İsimsiz",
      requestedBy: "Şirket yöneticisi",
      vehicleSuggestion: "Operasyon değerlendirmesi bekliyor",
    } as RouteRequestApproval));
  } catch {
    return routeRequestApprovalsMockData;
  }
}

export async function decideRouteRequest(
  routeId: number,
  status: "Onaylandi" | "Reddedildi" | "Revizyon Istendi",
) {
  return putRequest<{ message?: string }>(
    `/api/shuttle-plan-requests/route/${routeId}/status`,
    {
      Statu: status,
    },
  );
}
