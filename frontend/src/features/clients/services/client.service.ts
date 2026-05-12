import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/lib/api";
import { SERVICE_MANAGER_ROLE_ID } from "@/features/auth/constants";
import { registerUser } from "@/features/auth/services/auth.service";

import { clientsMockData } from "../constants";
import type { Client, ClientDto, CreateClientPayload } from "../types";

type ServiceOptions = {
  authToken?: string | null;
};

function mapTransportTypeLabel(value?: string | null) {
  if (
    value === "CorporateShuttle" ||
    value === "corporate-shuttle" ||
    value === "Corporate"
  ) {
    return "Şirket personel servisi";
  }

  return value ?? "Şirket personel servisi";
}

function mapSetupModel(value?: string | null): Client["setupModel"] {
  if (value === "ABC Managed") return "abc-managed";
  if (value === "Hybrid") return "hybrid";
  return "company-managed";
}

function mapClientDto(dto: ClientDto): Client {
  const numericId = dto.KurumId ?? dto.kurumId ?? 0;
  const name = dto.KurumAdi ?? dto.kurumAdi ?? "İsimsiz Client";
  const city = dto.AdresIl ?? dto.adresIl ?? "-";
  const district = dto.AdresIlce ?? dto.adresIlce ?? "-";
  const address =
    [district, city].filter((item) => item && item !== "-").join(", ") || "-";

  return {
    id: `CLT-${String(numericId).padStart(3, "0")}`,
    numericId,
    name,
    contactName: dto.YetkiliKisi ?? dto.yetkiliKisi ?? "-",
    phone: dto.Telefon ?? dto.telefon ?? "-",
    email: dto.Email ?? dto.email ?? "-",
    address,
    city,
    district,
    taxNumber: dto.VergiNo ?? dto.vergiNo ?? undefined,
    transportType: "corporate-shuttle",
    transportTypeLabel: mapTransportTypeLabel(dto.KurumTipi ?? dto.kurumTipi),
    setupModel: mapSetupModel(dto.KurulumTercihi ?? dto.kurulumTercihi),
    status: (dto.AktifMi ?? dto.aktifMi) === false ? "inactive" : "active",
    setupStatus: "pending",
    employeeCount: 0,
    stopCount: 0,
    routeRequestCount: 0,
  };
}

function toCreateClientDto(payload: CreateClientPayload) {
  const contactName = `${payload.contactFirstName} ${payload.contactLastName}`.trim();

  return {
    kurumAdi: payload.companyName,
    kurumTipi: "Corporate",
    vergiNo: payload.taxNumber || null,
    adresIl: payload.city,
    adresIlce: payload.district,
    yetkiliKisi: contactName,
    telefon: payload.phone,
    email: payload.email,
    kurulumTercihi:
      payload.setupModel === "abc-managed"
        ? "ABC Managed"
        : payload.setupModel === "hybrid"
          ? "Hybrid"
          : "Company Managed",
  };
}

export async function getClients(options: ServiceOptions = {}) {
  try {
    const clients = await getRequest<ClientDto[]>("/api/clients", {
      authToken: options.authToken,
    });
    return clients.map(mapClientDto);
  } catch {
    return clientsMockData;
  }
}

export async function getClientById(
  clientId: string | number,
  options: ServiceOptions = {},
) {
  try {
    const client = await getRequest<ClientDto>(`/api/clients/${clientId}`, {
      authToken: options.authToken,
    });
    return mapClientDto(client);
  } catch {
    return (
      clientsMockData.find(
        (client) =>
          client.numericId === Number(clientId) || client.id === clientId,
      ) ?? clientsMockData[0]
    );
  }
}

export async function createClient(payload: CreateClientPayload) {
  const createdClient = await postRequest<ClientDto>(
    "/api/clients",
    toCreateClientDto(payload),
  );
  const client = mapClientDto(createdClient);
  const clientId = client.numericId;

  if (!clientId) {
    throw new Error(
      "Client olusturuldu ancak backend kurumId dondurmedi. Yetkili kullanici kuruma baglanamadi.",
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

  return client;
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
