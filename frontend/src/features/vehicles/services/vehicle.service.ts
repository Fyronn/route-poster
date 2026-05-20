import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/api";

import { vehiclesMockData } from "../constants";
import type { Vehicle, VehicleUpdateDto } from "../types";

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

export async function updateVehicle(vehicleId: number, data: VehicleUpdateDto) {

  try {

    const updateReq = await putRequest<Vehicle>(`/api/vehicles/${vehicleId}`, data);
    if (typeof updateReq === undefined) {
      console.log(`Arac güncelleme işlemi gövde olmadan döndü`)
    }


  } catch (e) {
    console.log(`Arac güncellemesinde hata ${e}`)
  }



}

export async function deleteVehicle(vehicleId: number) {
  try {
    const deleteReq = await deleteRequest<Vehicle>(`/api/vehicles/${vehicleId}`)

  } catch (e) {
    console.log(e)

  }



}

