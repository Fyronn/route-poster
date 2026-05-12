import { getRequest, postRequest } from "@/lib/api";

import { tripsMockData } from "../constants";
import type { Trip, TripDto } from "../types";

type ServiceOptions = {
  authToken?: string | null;
  routeIds?: number[];
};

function mapTripStatus(status?: string | null): Trip["status"] {
  if (status === "Başladı" || status === "Basladi" || status === "Started") {
    return "started";
  }
  if (status === "Tamamlandı" || status === "Tamamlandi" || status === "Completed") {
    return "completed";
  }
  if (status === "İptal" || status === "Iptal" || status === "Cancelled") {
    return "cancelled";
  }
  return "planned";
}

function mapTripDto(dto: TripDto): Trip {
  const startTime = dto.BaslamaZamani ?? dto.baslamaZamani;
  const routeId = dto.RotaId ?? dto.rotaId;

  return {
    id: dto.SeferId ?? dto.seferId ?? 0,
    routeId: routeId ?? null,
    date: dto.SeferTarihi ?? dto.seferTarihi ?? "-",
    time: startTime
      ? new Date(startTime).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-",
    routeName: routeId ? `Rota #${routeId}` : "Rota atanmadı",
    vehicle: "Araç atanacak",
    driver: "Şoför atanacak",
    status: mapTripStatus(dto.Statu ?? dto.statu),
  };
}

export async function getTrips(options: ServiceOptions = {}) {
  try {
    const trips = await getRequest<TripDto[]>("/api/trips", {
      authToken: options.authToken,
    });
    const mappedTrips = trips.map(mapTripDto);

    if (Array.isArray(options.routeIds)) {
      const allowedRouteIds = new Set(options.routeIds);
      return mappedTrips.filter(
        (trip) => trip.routeId !== null && allowedRouteIds.has(trip.routeId),
      );
    }

    return mappedTrips;
  } catch {
    return tripsMockData;
  }
}

export async function createTrip(payload: {
  routeId: number;
  tripDate: string;
  startTime?: string;
}) {
  const trip = await postRequest<TripDto>("/api/trips", {
    rotaId: payload.routeId,
    seferTarihi: payload.tripDate,
    baslamaZamani: payload.startTime,
  });

  return mapTripDto(trip);
}
