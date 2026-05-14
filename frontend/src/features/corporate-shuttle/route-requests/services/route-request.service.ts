import { getRequest, postRequest } from "@/lib/api";

import { corporateRouteRequestsMockData } from "../constants";
import type { CorporateRouteRequest } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getCorporateRouteRequests(
  clientId: number,
  options: ServiceOptions = {},
) {
  assertClientId(clientId);

  try {
    const requests = await getRequest<CorporateRouteRequest[]>(
      `/api/corporate-shuttle/clients/${clientId}/route-requests`,
      { authToken: options.authToken },
    );
    return requests;
  } catch {
    return corporateRouteRequestsMockData.map((request) => ({
      ...request,
      clientId,
    }));
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
  assertClientId(clientId);

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

function assertClientId(clientId: number) {
  if (!Number.isFinite(clientId) || clientId <= 0) {
    throw new Error("Gecerli bir clientId olmadan corporate shuttle verisi okunamaz.");
  }
}
