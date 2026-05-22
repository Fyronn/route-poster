import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/api";

import { driversMockData } from "../constants";
import type { Driver, UpdateDriverDto } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getDrivers(options: ServiceOptions = {}) {
  try {
    const drivers = await getRequest<Driver[]>("/api/drivers", {
      authToken: options.authToken,
    });
    return drivers;
  } catch {
    return driversMockData;
  }
}


export async function updateDriver(driverId: number, data: UpdateDriverDto) {
  try {
    const updateDriver = await putRequest<Driver>(`/api/drivers/${driverId}`, {
      identityNumber: data.identityNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      isActive: data.isActive


    })



    return updateDriver

  } catch (e) {
    throw new Error(`${e}`)
  }

}

export async function deleteDriver(driverId: number) {

  try {
    const deleteReq = await deleteRequest<Driver>(`/api/drivers/${driverId}`)

  } catch (e) {
    console.log("Driver silme işlemi sırasında bir sorun oluştu")

  }



}

export async function createDriver(payload: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  identityNumber?: string;
  password?: string;
}) {
  const driver = await postRequest<Driver>("/api/drivers", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    identityNumber: payload.identityNumber,
    password: payload.password,
    isActive: true,
  });

  return driver;
}
