import { getRequest, postRequest } from "@/lib/api";
import type { CorporateRouteRequest } from "@/features/corporate-shuttle/route-requests/types";

import { serviceRoutesMockData } from "../constants";
import type { ServiceRoute } from "../types";

type ServiceOptions = {
  authToken?: string | null;
  clientId?: number | null;
};

export async function getServiceRoutes(options: ServiceOptions = {}) {
  try {
    const path = options.clientId
      ? `/api/service-routes/client/${options.clientId}`
      : "/api/service-routes";
    const routes = await getRequest<CorporateRouteRequest[]>(path, {
      authToken: options.authToken,
    });

    return routes.map<ServiceRoute>((route) => ({
      id: route.routeId,
      routeName: route.routeName || "İsimsiz rota",
      clientName: route.clientName || "Bilinmiyor",
      vehicle: "Araç atanacak",
      driver: "Şoför atanacak",
      stopCount: route.stopCount || 0,
      employeeCount: route.employeeCount || 0,
      workingDays: route.operatingDays || "-",
      status: route.status?.toLowerCase() === "approved" ? "planned" : "inactive",
    }));
  } catch {
    return serviceRoutesMockData;
  }
}

export async function createServiceRoute(payload: {
  clientId?: number | null;
  routeName: string;
  shift?: string;
  direction?: string;
  workingDays?: string;
  plannedStartTime?: string;
}) {
  const route = await postRequest<CorporateRouteRequest>("/api/service-routes", {
    routeName: payload.routeName,
    shiftType: payload.shift,
    direction: payload.direction,
    clientId: payload.clientId,
  });

  return {
    id: route.routeId,
    routeName: route.routeName || "İsimsiz rota",
    clientName: route.clientName || "Bilinmiyor",
    vehicle: "Araç atanacak",
    driver: "Şoför atanacak",
    stopCount: route.stopCount || 0,
    employeeCount: route.employeeCount || 0,
    workingDays: route.operatingDays || "-",
    status: "planned" as const,
  };
}
