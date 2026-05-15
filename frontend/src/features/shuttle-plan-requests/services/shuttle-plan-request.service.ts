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
      clientName: request.clientName || `Client #${request.clientId ?? "-"}`,
      employeeCount: request.passengerIds?.length ?? request.employeeCount ?? 0,
      id: request.routeId,
      routeCount: 1,
      status: normalizePlanStatus(request.status),
      stopCount:
        request.stopIds?.length ?? request.plannedStops?.length ?? request.stopCount ?? 0,
      submittedAt: new Date().toISOString(),
      submittedBy: "Sirket yoneticisi",
      summary: `${request.routeName || "Isimsiz rota"} icin servis plani talebi.`,
    }));
  } catch {
    return shuttlePlanRequestsMockData;
  }
}

export async function updateShuttlePlanRequestStatus(
  routeId: number,
  status: "Approved" | "Rejected",
  rejectionReason?: string,
) {
  return putRequest<{ message?: string }>(
    `/api/shuttle-plan-requests/route/${routeId}/status`,
    {
      comments: rejectionReason,
      rejectionReason,
      status,
    },
  );
}

function normalizePlanStatus(status?: string | null): ShuttlePlanRequest["status"] {
  const normalized = String(status ?? "")
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s-]+/g, "_");

  if (normalized === "approved" || normalized === "active") return "approved";
  if (normalized === "rejected") return "rejected";

  return "requested";
}
