import { getRequest, putRequest } from "@/lib/api";
import type { CorporateRouteRequest } from "@/features/corporate-shuttle/route-requests/types";

import { shuttlePlanRequestsMockData } from "../constants";
import type { ShuttlePlanRequest } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getShuttlePlanRequests(options: ServiceOptions = {}) {
  try {
    const requests = await getRequest<CorporateRouteRequest[]>(
      "/api/shuttle-plan-requests",
      { authToken: options.authToken },
    );

    return requests.map<ShuttlePlanRequest>((request) => ({
      id: request.routeId,
      clientName: request.clientName || "Bilinmiyor",
      submittedBy: "Şirket yöneticisi",
      submittedAt: new Date().toISOString(),
      employeeCount: request.employeeCount || 0,
      stopCount: request.stopCount || 0,
      routeCount: 1,
      summary: `${request.routeName || "İsimsiz rota"} için servis planı talebi.`,
      status: (request.status?.toLowerCase() === "requested" ? "submitted" : request.status?.toLowerCase()) as ShuttlePlanRequest["status"],
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
