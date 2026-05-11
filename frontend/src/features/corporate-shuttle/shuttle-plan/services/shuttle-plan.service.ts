import { postRequest } from "@/lib/api";

import { shuttlePlanMockData } from "../constants";

export async function getCorporateShuttlePlan() {
  return shuttlePlanMockData;
}

export async function submitCorporateShuttlePlan(clientId: number) {
  return postRequest<{ message?: string }>(
    `/api/corporate-shuttle/clients/${clientId}/shuttle-plan/submit`,
    {},
  );
}
