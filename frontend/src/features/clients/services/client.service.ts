import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/lib/api";
import { SERVICE_MANAGER_ROLE_ID } from "@/features/auth/constants";
import { registerUser } from "@/features/auth/services/auth.service";

import { clientsMockData } from "../constants";
import type { Client, CreateClientPayload } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

export async function getClients(options: ServiceOptions = {}) {
  try {
    const clients = await getRequest<Client[]>("/api/clients", {
      authToken: options.authToken,
    });
    return clients.map((client) => ({
      ...client,
      setupStatus: client.setupStatus || "pending",
      employeeCount: client.employeeCount || 0,
      stopCount: client.stopCount || 0,
      routeRequestCount: client.routeRequestCount || 0,
    }));
  } catch {
    return clientsMockData;
  }
}

export async function getClientById(
  clientId: string | number,
  options: ServiceOptions = {},
) {
  try {
    const client = await getRequest<Client>(`/api/clients/${clientId}`, {
      authToken: options.authToken,
    });
    return {
      ...client,
      setupStatus: client.setupStatus || "pending",
      employeeCount: client.employeeCount || 0,
      stopCount: client.stopCount || 0,
      routeRequestCount: client.routeRequestCount || 0,
    };
  } catch {
    return (
      clientsMockData.find((c) => c.clientId === Number(clientId)) ??
      clientsMockData[0]
    );
  }
}

export async function createClient(payload: CreateClientPayload) {
  const contactName = `${payload.contactFirstName} ${payload.contactLastName}`.trim();

  const createDto = {
    clientName: payload.companyName,
    clientType: "Corporate",
    taxNumber: payload.taxNumber || null,
    city: payload.city,
    district: payload.district,
    authorizedPerson: contactName,
    phone: payload.phone,
    email: payload.email,
    setupPreference:
      payload.setupModel === "abc-managed"
        ? "ABC Managed"
        : payload.setupModel === "hybrid"
          ? "Hybrid"
          : "Company Managed",
  };

  const createdClient = await postRequest<Client>(
    "/api/clients",
    createDto,
  );
  
  const clientId = createdClient.clientId;

  if (!clientId) {
    throw new Error(
      "Client olusturuldu ancak backend clientId dondurmedi. Yetkili kullanici kuruma baglanamadi.",
    );
  }

  await registerUser({
    clientId,
    email: payload.email,
    firstName: payload.contactFirstName,
    lastName: payload.contactLastName,
    password: payload.password,
    roleId: SERVICE_MANAGER_ROLE_ID,
  });

  return {
    ...createdClient,
    setupStatus: "pending" as const,
    employeeCount: 0,
    stopCount: 0,
    routeRequestCount: 0,
  };
}

export async function updateClient(
  clientId: string | number,
  payload: Partial<CreateClientPayload>,
) {
  return putRequest<void>(`/api/clients/${clientId}`, {
    ...payload,
  });
}

export async function deleteClient(clientId: string | number) {
  return deleteRequest<void>(`/api/clients/${clientId}`);
}
