import { getRequest, putRequest } from "@/lib/api";
import {
  mapRouteRequestDto,
} from "@/features/corporate-shuttle/route-requests/services/route-request.service";
import type { RouteRequestDto } from "@/features/corporate-shuttle/route-requests/types";

import { shuttlePlanRequestsMockData } from "../constants";
import type { ShuttlePlanRequest } from "../types";

export async function getShuttlePlanRequests() {
  try {
    const requests = await getRequest<RouteRequestDto[]>("/api/shuttle-plan-requests");
    const mapped = requests.map(mapRouteRequestDto);

    return mapped.map<ShuttlePlanRequest>((request) => ({
      id: request.id,
      clientName: request.clientName,
      submittedBy: "Şirket yöneticisi",
      submittedAt: new Date().toISOString(),
      employeeCount: request.employeeCount,
      stopCount: request.stopCount,
      routeCount: 1,
      summary: `${request.routeName} için servis planı talebi.`,
      status:
        request.status === "requested" ? "submitted" : request.status,
    }));
  } catch {
    return shuttlePlanRequestsMockData;
  }
}

export async function updateShuttlePlanRequestStatus(
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
