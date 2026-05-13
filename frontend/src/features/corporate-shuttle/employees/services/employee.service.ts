import { getRequest, postRequest } from "@/lib/api";

import { corporateEmployeesMockData } from "../constants";
import type { CorporateEmployee } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getCorporateEmployees(
  clientId = 1,
  options: ServiceOptions = {},
) {
  try {
    const employees = await getRequest<CorporateEmployee[]>(
      `/api/corporate-shuttle/clients/${clientId}/employees`,
      { authToken: options.authToken },
    );
    return employees;
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
  const employee = await postRequest<CorporateEmployee>(
    `/api/corporate-shuttle/clients/${clientId}/employees`,
    {
      clientId: clientId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      identityNumber: payload.identityNumber,
    },
  );

  return employee;
}
