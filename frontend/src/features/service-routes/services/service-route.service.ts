import { getRequest, postRequest } from "@/lib/api";
import { mapRouteRequestDto } from "@/features/corporate-shuttle/route-requests/services/route-request.service";
import type { RouteRequestDto } from "@/features/corporate-shuttle/route-requests/types";

import { serviceRoutesMockData } from "../constants";
import type { ServiceRoute } from "../types";

export async function getServiceRoutes() {
  try {
    const routes = await getRequest<RouteRequestDto[]>("/api/service-routes");

    return routes.map<ServiceRoute>((route) => {
      const mapped = mapRouteRequestDto(route);

      return {
        id: mapped.id,
        routeName: mapped.routeName,
        clientName: mapped.clientName,
        vehicle: "Araç atanacak",
        driver: "Şoför atanacak",
        stopCount: mapped.stopCount,
        employeeCount: mapped.employeeCount,
        workingDays: mapped.workingDays,
        status: mapped.status === "approved" ? "planned" : "inactive",
      };
    });
  } catch {
    return serviceRoutesMockData;
  }
}

export async function createServiceRoute(payload: {
  routeName: string;
  shift?: string;
  direction?: string;
  workingDays?: string;
  plannedStartTime?: string;
}) {
  const route = await postRequest<RouteRequestDto>("/api/service-routes", {
    rotaAdi: payload.routeName,
    vardiyaTipi: payload.shift,
    yon: payload.direction,
    calismaGunleri: payload.workingDays,
    planlananBaslangicSaati: payload.plannedStartTime,
  });

  const mapped = mapRouteRequestDto(route);

  return {
    id: mapped.id,
    routeName: mapped.routeName,
    clientName: mapped.clientName,
    vehicle: "Araç atanacak",
    driver: "Şoför atanacak",
    stopCount: mapped.stopCount,
    employeeCount: mapped.employeeCount,
    workingDays: mapped.workingDays,
    status: "planned" as const,
  };
}
