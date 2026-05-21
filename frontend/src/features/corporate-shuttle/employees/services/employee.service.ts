import { deleteRequest, getRequest, postRequest, putRequest } from "@/lib/api";

import { corporateEmployeesMockData } from "../constants";
import type { CorporateEmployee, CorporateEmployeeEditRequest, CorporateEmployeeEditResponse } from "../types";

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

export async function editCorporateEmployee(clientId:number,userId:number,data:CorporateEmployeeEditRequest) {

  try{

    const editReq = await putRequest<CorporateEmployeeEditResponse>
    (`/api/corporate-shuttle/clients/${clientId}/employees/${userId}`,data)
    return editReq


  }catch(e){
    console.log(`Servis yöneticisi çalışanlarda güncelleme yapmaya çalışırken hata oluştu`)

  }
  
}

export async function deleteCorporateEmployee(clientId:number,userId:number) {

  try{
    const deleteReq = await deleteRequest<CorporateEmployeeEditResponse>(`/api/corporate-shuttle/clients/${clientId}/employees/${userId}`)
    

  }catch(e){
    console.log(`Servis yöneticisi elemanları silmeye çalışırken bir sorunla karşılaştı ${e}`)
  }

  
}



function assertClientId(clientId: number) {
  if (!Number.isFinite(clientId) || clientId <= 0) {
    throw new Error("Gecerli bir clientId olmadan corporate shuttle verisi okunamaz.");
  }
}
