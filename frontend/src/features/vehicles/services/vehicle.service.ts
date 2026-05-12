import { getRequest, postRequest } from "@/lib/api";

import { vehiclesMockData } from "../constants";
import type { Vehicle, VehicleDto } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export function mapVehicleDto(dto: VehicleDto): Vehicle {
  return {
    id: dto.AracId ?? dto.aracId ?? 0,
    plate: dto.Plaka ?? dto.plaka ?? "-",
    capacity: dto.Kapasite ?? dto.kapasite ?? 0,
    model: dto.MarkaModel ?? dto.markaModel ?? "-",
    productionYear: dto.UretimYili ?? dto.uretimYili ?? undefined,
    vehicleType: dto.AracTipi ?? dto.aracTipi ?? "-",
    equipment: dto.DonanimOzellikleri ?? dto.donanimOzellikleri ?? undefined,
    status: (dto.AktifMi ?? dto.aktifMi) === false ? "inactive" : "active",
  };
}

export async function getVehicles(options: ServiceOptions = {}) {
  try {
    const vehicles = await getRequest<VehicleDto[]>("/api/vehicles", {
      authToken: options.authToken,
    });
    return vehicles.map(mapVehicleDto);
  } catch {
    return vehiclesMockData;
  }
}

export async function createVehicle(payload: {
  capacity: number;
  equipment?: string;
  model?: string;
  plate: string;
  productionYear?: number;
  vehicleType?: string;
}) {
  const vehicle = await postRequest<VehicleDto>("/api/vehicles", {
    plaka: payload.plate,
    kapasite: payload.capacity,
    markaModel: payload.model,
    uretimYili: payload.productionYear,
    aracTipi: payload.vehicleType,
    donanimOzellikleri: payload.equipment,
    aktifMi: true,
  });

  return mapVehicleDto(vehicle);
}
