import { getRequest, postRequest } from "@/lib/api";

import { tripsMockData } from "../constants";
import type { CreateTripAssignmentDto, CreateTripDto, Trip, TripAssignment } from "../types";

type ServiceOptions = {
  authToken?: string | null;
  routeIds?: number[];
};

export const tripAssignmentsMockData: TripAssignment[] = [
  {
    id: 1,
    tripId: 8001,
    vehicleId: 101,
    driverId: 201,
    tripDate: "2026-05-08",
    vehiclePlateNumber: "34 ABC 204",
    driverFirstName: "Mehmet",
    driverLastName: "Kaya",
  },
  {
    id: 2,
    tripId: 8002,
    vehicleId: 102,
    driverId: 202,
    tripDate: "2026-05-08",
    vehiclePlateNumber: "34 DEF 112",
    driverFirstName: "Serkan",
    driverLastName: "Yılmaz",
  },
  {
    id: 3,
    tripId: 8003,
    vehicleId: 103,
    driverId: 203,
    tripDate: "2026-05-08",
    vehiclePlateNumber: "34 GHI 021",
    driverFirstName: "Derya",
    driverLastName: "Şahin",
  },
];

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

export async function createTrip(payload: CreateTripDto, options?: { authToken?: string | null }) {
  const trip = await postRequest<Trip, CreateTripDto>("/api/trips", {
    routeId: payload.routeId,
    tripDate: payload.tripDate,
    startTime: payload.startTime,
    endTime: payload.endTime,
  }, {
    authToken: options?.authToken
  });

  return trip;
}

export async function getTripAssignments(options: { authToken?: string | null } = {}) {
  try {
    const assignments = await getRequest<TripAssignment[]>("/api/trip-assignments", {
      authToken: options.authToken,
    });
    return assignments;
  } catch {
    return tripAssignmentsMockData;
  }
}

export async function createTripAssignment(payload: CreateTripAssignmentDto, options?: { authToken?: string | null }) {
  const assignment = await postRequest<TripAssignment, CreateTripAssignmentDto>("/api/trip-assignments", {
    tripId: payload.tripId,
    vehicleId: payload.vehicleId,
    driverId: payload.driverId,
    serviceSupervisorId: payload.serviceSupervisorId,
    createdBy: payload.createdBy,
  }, {
    authToken: options?.authToken
  });

  return assignment;
}
