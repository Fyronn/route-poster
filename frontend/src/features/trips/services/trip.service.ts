import { getRequest, postRequest } from "@/lib/api";

import { tripsMockData } from "../constants";
import type { Trip, TripDto } from "../types";

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

export async function getTrips() {
  try {
    const trips = await getRequest<TripDto[]>("/api/trips");
    return trips.map(mapTripDto);
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
