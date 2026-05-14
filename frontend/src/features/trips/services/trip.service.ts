import { getRequest, postRequest } from "@/lib/api";

import { tripsMockData } from "../constants";
import type { Trip } from "../types";

type ServiceOptions = {
  authToken?: string | null;
  routeIds?: number[];
};

export async function getTrips(options: ServiceOptions = {}) {
  try {
    const trips = await getRequest<Trip[]>("/api/trips", {
      authToken: options.authToken,
    });

    if (Array.isArray(options.routeIds)) {
      const allowedRouteIds = new Set(options.routeIds);
      return trips.filter(
        (trip) => trip.routeId !== null && trip.routeId !== undefined && allowedRouteIds.has(trip.routeId),
      );
    }

    return trips;
  } catch {
    return tripsMockData;
  }
}

export async function createTrip(payload: {
  routeId: number;
  tripDate: string;
  startTime?: string;
}) {
  const trip = await postRequest<Trip>("/api/trips", {
    routeId: payload.routeId,
    startDate: payload.tripDate,
    startTime: payload.startTime,
  });

  return trip;
}
