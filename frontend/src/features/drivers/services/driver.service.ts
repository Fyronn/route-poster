import { getRequest, postRequest } from "@/lib/api";

import { driversMockData } from "../constants";
import type { Driver } from "../types";

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
    passwordHash: payload.password,
    isActive: true,
  });

  return driver;
}
