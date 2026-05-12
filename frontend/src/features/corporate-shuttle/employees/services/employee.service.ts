import { getRequest, postRequest } from "@/lib/api";

import { corporateEmployeesMockData } from "../constants";
import type { CorporateEmployee, EmployeeDto } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export function mapEmployeeDto(dto: EmployeeDto): CorporateEmployee {
  const firstName = dto.Ad ?? dto.ad ?? "";
  const lastName = dto.Soyad ?? dto.soyad ?? "";

  return {
    id: dto.KullaniciId ?? dto.kullaniciId ?? 0,
    fullName: `${firstName} ${lastName}`.trim() || "İsimsiz çalışan",
    department: "Atanmamış",
    email: dto.Email ?? dto.email ?? "-",
    phone: dto.Telefon ?? dto.telefon ?? "-",
    homeDistrict: "-",
    preferredStop: "Durak seçilmedi",
    status: (dto.AktifMi ?? dto.aktifMi) === false ? "inactive" : "active",
  };
}

export async function getCorporateEmployees(
  clientId = 1,
  options: ServiceOptions = {},
) {
  try {
    const employees = await getRequest<EmployeeDto[]>(
      `/api/corporate-shuttle/clients/${clientId}/employees`,
      { authToken: options.authToken },
    );
    return employees.map(mapEmployeeDto);
  } catch {
    return corporateEmployeesMockData;
  }
}

export async function createCorporateEmployee(
  clientId: number,
  payload: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    identityNumber?: string;
  },
) {
  const employee = await postRequest<EmployeeDto>(
    `/api/corporate-shuttle/clients/${clientId}/employees`,
    {
      kurumId: clientId,
      ad: payload.firstName,
      soyad: payload.lastName,
      email: payload.email,
      telefon: payload.phone,
      kimlikNo: payload.identityNumber,
    },
  );

  return mapEmployeeDto(employee);
}
