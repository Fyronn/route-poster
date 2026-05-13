import { getRequest, postRequest } from "@/lib/api";

import { corporateRouteRequestsMockData } from "../constants";
import type { CorporateRouteRequest } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getCorporateRouteRequests(
  clientId = 1,
  options: ServiceOptions = {},
) {
  try {
    const requests = await getRequest<CorporateRouteRequest[]>(
      `/api/corporate-shuttle/clients/${clientId}/route-requests`,
      { authToken: options.authToken },
    );
    return requests;
  } catch {
    return corporateRouteRequestsMockData;
  }
}

export async function createCorporateRouteRequest(
  clientId: number,
  payload: {
    routeName: string;
    shiftType?: string;
    direction?: string;
    operatingDays?: string;
    plannedStartTime?: string;
    plannedStops?: Array<{
      estimatedArrivalTime?: string;
      sequence: number;
      stopId: number;
      stopName: string;
    }>;
  },
) {
  const request = await postRequest<CorporateRouteRequest>(
    `/api/corporate-shuttle/clients/${clientId}/route-requests`,
    {
      clientId: clientId,
      routeName: payload.routeName,
      shiftType: payload.shiftType,
      direction: payload.direction,
      operatingDays: payload.operatingDays,
      plannedStartTime: payload.plannedStartTime,
      // mapping workingDays / plannedStops etc manually if backend still doesn't support them on this particular DTO
    },
  );

  return {
    ...request,
    plannedStops: payload.plannedStops,
  };
}
