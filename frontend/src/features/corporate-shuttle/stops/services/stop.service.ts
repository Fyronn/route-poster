import { getRequest, postRequest } from "@/lib/api";

import { corporateStopsMockData } from "../constants";
import type { CorporateStopRequest } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getCorporateStops(
  clientId: number,
  options: ServiceOptions = {},
) {
  assertClientId(clientId);

  try {
    const stops = await getRequest<CorporateStopRequest[]>(
      `/api/corporate-shuttle/clients/${clientId}/stops`,
      { authToken: options.authToken },
    );
    return stops;
  } catch {
    return corporateStopsMockData.map((stop) => ({ ...stop, clientId }));
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
  assertClientId(clientId);

  const stop = await postRequest<CorporateStopRequest>(
    `/api/corporate-shuttle/clients/${clientId}/stops`,
    {
      clientId,
      address: payload.address,
      operatorNote: payload.operatorNote,
      stopName: payload.stopName,
      latitude: payload.latitude,
      longitude: payload.longitude,
    },
  );

  return stop;
}

function assertClientId(clientId: number) {
  if (!Number.isFinite(clientId) || clientId <= 0) {
    throw new Error("Gecerli bir clientId olmadan corporate shuttle verisi okunamaz.");
  }
}
