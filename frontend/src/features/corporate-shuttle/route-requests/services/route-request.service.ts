import { getRequest, postRequest } from "@/lib/api";

import { corporateRouteRequestsMockData } from "../constants";
import type { CorporateRouteRequest, RouteRequestDto } from "../types";

export function mapRouteRequestStatus(
  status?: string | null,
): CorporateRouteRequest["status"] {
  if (status === "Aktif") return "approved";
  if (status === "Plan Gönderildi" || status === "Plan Gonderildi") {
    return "submitted";
  }
  if (status === "Onaylandı" || status === "Onaylandi") return "approved";
  if (status === "Reddedildi") return "rejected";
  if (status === "Revizyon İstendi" || status === "Revizyon Istendi") {
    return "revision_requested";
  }
  return "requested";
}

function mapDirection(direction?: string | null) {
  if (direction === "Gidis") return "Gidiş";
  if (direction === "Donus") return "Dönüş";
  return direction ?? "-";
}

function mapWorkingDays(days?: string | null) {
  if (days === "1,2,3,4,5") return "Pzt - Cum";
  if (days === "1,2,3,4,5,6") return "Pzt - Cmt";
  return days ?? "-";
}

export function mapRouteRequestDto(dto: RouteRequestDto): CorporateRouteRequest {
  const routeId = dto.RotaId ?? dto.rotaId ?? 0;
  const clientId = dto.KurumId ?? dto.kurumId;
  const direction = dto.Yon ?? dto.yon;
  const isReturn = direction === "Donus" || direction === "Dönüş";

  return {
    id: routeId,
    clientName: clientId ? `Client #${clientId}` : "Client",
    routeName: dto.RotaAdi ?? dto.rotaAdi ?? "İsimsiz rota",
    startPoint: isReturn ? "Şirket Kampüsü" : "Toplanma Bölgesi",
    endPoint: isReturn ? "Dağıtım Bölgesi" : "Şirket Kampüsü",
    direction: mapDirection(direction),
    shift: dto.VardiyaTipi ?? dto.vardiyaTipi ?? "-",
    workingDays: mapWorkingDays(dto.CalismaGunleri ?? dto.calismaGunleri),
    plannedStartTime:
      dto.PlanlananBaslangicSaati ?? dto.planlananBaslangicSaati ?? "-",
    stopCount: 0,
    employeeCount: 0,
    estimatedDistanceKm: 0,
    estimatedDurationMin:
      dto.TahminiSureDakika ?? dto.tahminiSureDakika ?? 0,
    status: mapRouteRequestStatus(dto.Statu ?? dto.statu),
  };
}

export async function getCorporateRouteRequests(clientId = 1) {
  try {
    const requests = await getRequest<RouteRequestDto[]>(
      `/api/corporate-shuttle/clients/${clientId}/route-requests`,
    );
    return requests.map(mapRouteRequestDto);
  } catch {
    return corporateRouteRequestsMockData;
  }
}

export async function createCorporateRouteRequest(
  clientId: number,
  payload: {
    routeName: string;
    shift?: string;
    direction?: string;
    workingDays?: string;
    plannedStartTime?: string;
  },
) {
  const request = await postRequest<RouteRequestDto>(
    `/api/corporate-shuttle/clients/${clientId}/route-requests`,
    {
      rotaAdi: payload.routeName,
      vardiyaTipi: payload.shift,
      yon: payload.direction,
      calismaGunleri: payload.workingDays,
      planlananBaslangicSaati: payload.plannedStartTime,
    },
  );

  return mapRouteRequestDto(request);
}
