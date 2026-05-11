import { getRequest, putRequest } from "@/lib/api";
import {
  mapRouteRequestDto,
} from "@/features/corporate-shuttle/route-requests/services/route-request.service";
import type { RouteRequestDto } from "@/features/corporate-shuttle/route-requests/types";

import { routeRequestApprovalsMockData } from "../constants";
import type { RouteRequestApproval } from "../types";

export async function getRouteRequestApprovals() {
  try {
    const requests = await getRequest<RouteRequestDto[]>("/api/shuttle-plan-requests");
    return requests.map<RouteRequestApproval>((request) => ({
      ...mapRouteRequestDto(request),
      requestedBy: "Şirket yöneticisi",
      vehicleSuggestion: "Operasyon değerlendirmesi bekliyor",
    }));
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
