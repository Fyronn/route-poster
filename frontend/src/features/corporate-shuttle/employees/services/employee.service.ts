import { getRequest, postRequest } from "@/lib/api";

import { corporateEmployeesMockData } from "../constants";
import type { CorporateEmployee } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getCorporateEmployees(
  clientId: number,
  options: ServiceOptions = {},
) {
  assertClientId(clientId);

  try {
    const employees = await getRequest<CorporateEmployee[]>(
      `/api/corporate-shuttle/clients/${clientId}/employees`,
      { authToken: options.authToken },
    );
    return employees;
  } catch {
    return corporateEmployeesMockData.map((employee) => ({
      ...employee,
      clientId,
    }));
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
  assertClientId(clientId);

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

function assertClientId(clientId: number) {
  if (!Number.isFinite(clientId) || clientId <= 0) {
    throw new Error("Gecerli bir clientId olmadan corporate shuttle verisi okunamaz.");
  }
}
