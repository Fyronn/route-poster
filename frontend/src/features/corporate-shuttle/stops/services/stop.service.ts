import { getRequest, postRequest } from "@/lib/api";

import { corporateStopsMockData } from "../constants";
import type { CorporateStopRequest, StopRequestDto } from "../types";

function mapStatus(status?: string | null): CorporateStopRequest["status"] {
  if (status === "Onaylandi" || status === "Onaylandı") return "approved";
  if (status === "Reddedildi") return "rejected";
  if (status === "Revizyon") return "revision_requested";
  return "requested";
}

export function mapStopDto(dto: StopRequestDto): CorporateStopRequest {
  const status = dto.Statu ?? dto.statu;
  const latitude = dto.Enlem ?? dto.enlem ?? undefined;
  const longitude = dto.Boylam ?? dto.boylam ?? undefined;

  return {
    id: dto.DurakId ?? dto.durakId ?? 0,
    stopName: dto.DurakAdi ?? dto.durakAdi ?? "İsimsiz durak",
    address:
      dto.Adres ??
      dto.adres ??
      (latitude && longitude ? `${latitude}, ${longitude}` : "-"),
    district: "-",
    stopType: "both",
    employeeCount: 0,
    status: mapStatus(status),
    latitude,
    longitude,
    operatorNote: dto.OperatorNotu ?? dto.operatorNotu ?? undefined,
  };
}

export async function getCorporateStops(clientId = 1) {
  try {
    const stops = await getRequest<StopRequestDto[]>(
      `/api/corporate-shuttle/clients/${clientId}/stops`,
    );
    return stops.map(mapStopDto);
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
  const stop = await postRequest<StopRequestDto>(
    `/api/corporate-shuttle/clients/${clientId}/stops`,
    {
      durakAdi: payload.stopName,
      adres: payload.address,
      enlem: payload.latitude,
      boylam: payload.longitude,
      operatorNotu: payload.operatorNote,
    },
  );

  return mapStopDto(stop);
}
