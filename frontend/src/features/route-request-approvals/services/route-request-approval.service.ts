import { getRequest, putRequest } from "@/lib/api";
import type {
  CorporateRouteRequest,
  RoutePassengerDto,
  RouteRequestPassenger,
  RouteRequestStopPlan,
  RouteStopDto,
} from "@/features/corporate-shuttle/route-requests/types";

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
      employeeCount: request.passengers?.length ?? request.passengerIds?.length,
      id: request.routeId,
      plannedStops: normalizeRouteStops(request.stops),
      requestedBy: "Sirket yoneticisi",
      routeName: request.routeName || "Isimsiz",
      selectedPassengers: normalizeRoutePassengers(request.passengers),
      stopCount: request.stops?.length ?? request.stopIds?.length,
      vehicleSuggestion: "Operasyon degerlendirmesi bekliyor",
    }));
  } catch {
    return routeRequestApprovalsMockData;
  }
}

export async function decideRouteRequest(
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

function normalizeRouteStops(
  stops?: RouteStopDto[] | null,
): RouteRequestStopPlan[] | undefined {
  if (!stops?.length) return undefined;

  return [...stops]
    .sort(
      (first, second) =>
        (first.stopOrder ?? Number.MAX_SAFE_INTEGER) -
        (second.stopOrder ?? Number.MAX_SAFE_INTEGER),
    )
    .map((stop, index) => ({
      sequence: stop.stopOrder ?? index + 1,
      stopId: stop.stopId,
      stopName: stop.stopName || `Durak #${stop.stopId}`,
    }));
}

function normalizeRoutePassengers(
  passengers?: RoutePassengerDto[] | null,
): RouteRequestPassenger[] | undefined {
  if (!passengers?.length) return undefined;

  return passengers.map((passenger) => ({
    passengerId: passenger.passengerId,
    passengerName: passenger.fullName || `Calisan #${passenger.passengerId}`,
  }));
}
