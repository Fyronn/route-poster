import { getRequest, postRequest } from "@/lib/api";

import { shuttlePlanMockData } from "../constants";
import type { CorporateEmployee } from "../../employees/types";
import type { CorporateRouteRequest } from "../../route-requests/types";
import type { CorporateStopRequest } from "../../stops/types";
import type { ShuttlePlanSummary } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getCorporateShuttlePlan(
  clientId: number,
  options: ServiceOptions = {},
): Promise<ShuttlePlanSummary> {
  assertClientId(clientId);

  try {
    const [employees, stops, routes] = await Promise.all([
      getRequest<CorporateEmployee[]>(
        `/api/corporate-shuttle/clients/${clientId}/employees`,
        { authToken: options.authToken },
      ),
      getRequest<CorporateStopRequest[]>(
        `/api/corporate-shuttle/clients/${clientId}/stops`,
        { authToken: options.authToken },
      ),
      getRequest<CorporateRouteRequest[]>(
        `/api/corporate-shuttle/clients/${clientId}/route-requests`,
        { authToken: options.authToken },
      ),
    ]);

    return buildPlanSummary(clientId, employees, stops, routes);
  } catch {
    return {
      ...shuttlePlanMockData,
      clientName: `Client #${clientId}`,
      employeeCount: shuttlePlanMockData.routes.reduce(
        (total, route) => total + (route.employeeCount ?? 0),
        0,
      ),
      routeRequestCount: shuttlePlanMockData.routes.length,
      routes: shuttlePlanMockData.routes.map((route) => ({
        ...route,
        clientId,
        clientName: `Client #${clientId}`,
      })),
    };
  }
}

export async function submitCorporateShuttlePlan(clientId: number) {
  assertClientId(clientId);

  return postRequest<{ message?: string }>(
    `/api/corporate-shuttle/clients/${clientId}/shuttle-plan/submit`,
    {},
  );
}

function buildPlanSummary(
  clientId: number,
  employees: CorporateEmployee[],
  stops: CorporateStopRequest[],
  routes: CorporateRouteRequest[],
): ShuttlePlanSummary {
  return {
    clientName: `Client #${clientId}`,
    managerName: "Servis yoneticisi",
    employeeCount: employees.length,
    stopCount: stops.length,
    routeRequestCount: routes.length,
    status: routes.some((route) =>
      ["plan sent", "submitted"].includes(
        String(route.status ?? "").trim().toLocaleLowerCase("tr-TR"),
      ),
    )
      ? "submitted"
      : "draft",
    routes,
  };
}

function assertClientId(clientId: number) {
  if (!Number.isFinite(clientId) || clientId <= 0) {
    throw new Error("Gecerli bir clientId olmadan corporate shuttle verisi okunamaz.");
  }
}
