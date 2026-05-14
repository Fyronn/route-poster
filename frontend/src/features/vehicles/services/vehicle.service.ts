import { getRequest, postRequest } from "@/lib/api";

import { vehiclesMockData } from "../constants";
import type { Vehicle } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getVehicles(options: ServiceOptions = {}) {
  try {
    const vehicles = await getRequest<Vehicle[]>("/api/vehicles", {
      authToken: options.authToken,
    });
    return vehicles;
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
  const vehicle = await postRequest<Vehicle>("/api/vehicles", {
    plateNumber: payload.plate,
    capacity: payload.capacity,
    brandModel: payload.model,
    productionYear: payload.productionYear,
    vehicleType: payload.vehicleType,
    equipmentFeatures: payload.equipment,
    isActive: true,
  });

  return vehicle;
}


