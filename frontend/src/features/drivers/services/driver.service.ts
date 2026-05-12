import { getRequest, postRequest } from "@/lib/api";

import { driversMockData } from "../constants";
import type { Driver, DriverDto } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export function mapDriverDto(dto: DriverDto): Driver {
  const firstName = dto.Ad ?? dto.ad ?? "";
  const lastName = dto.Soyad ?? dto.soyad ?? "";

  return {
    id: dto.KullaniciId ?? dto.kullaniciId ?? 0,
    identityNumber: dto.KimlikNo ?? dto.kimlikNo ?? undefined,
    fullName: `${firstName} ${lastName}`.trim() || "Isimsiz sofor",
    email: dto.Email ?? dto.email ?? "-",
    phone: dto.Telefon ?? dto.telefon ?? "-",
    status: (dto.AktifMi ?? dto.aktifMi) === false ? "inactive" : "active",
  };
}

export async function getDrivers(options: ServiceOptions = {}) {
  try {
    const drivers = await getRequest<DriverDto[]>("/api/drivers", {
      authToken: options.authToken,
    });
    return drivers.map(mapDriverDto);
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
}) {
  const driver = await postRequest<DriverDto>("/api/drivers", {
    ad: payload.firstName,
    soyad: payload.lastName,
    email: payload.email,
    telefon: payload.phone,
    kimlikNo: payload.identityNumber,
    aktifMi: true,
  });

  return mapDriverDto(driver);
}
