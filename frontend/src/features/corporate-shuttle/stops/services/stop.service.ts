import { getRequest, postRequest } from "@/lib/api";

import { corporateStopsMockData } from "../constants";
import type { CorporateStopRequest } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getCorporateStops(
  clientId = 1,
  options: ServiceOptions = {},
) {
  try {
    const stops = await getRequest<CorporateStopRequest[]>(
      `/api/corporate-shuttle/clients/${clientId}/stops`,
      { authToken: options.authToken },
    );
    return stops;
  } catch {
    return corporateStopsMockData;
  }
}

export async function createCorporateStop(
  clientId: number,
  payload: {
    stopName: string;
    address: string;
    latitude?: number;
    longitude?: number;
    operatorNote?: string;
  },
) {
  const stop = await postRequest<CorporateStopRequest>(
    `/api/corporate-shuttle/clients/${clientId}/stops`,
    {
      clientId: clientId,
      stopName: payload.stopName,
      latitude: payload.latitude,
      longitude: payload.longitude,
    },
  );

  return stop;
}
