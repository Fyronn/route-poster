import type {
  EntityStatus,
  SetupModel,
  TransportType,
  WorkflowStatus,
} from "@/types/common";

export type ClientDto = {
  KurumId?: number;
  kurumId?: number;
  KurumAdi?: string;
  kurumAdi?: string;
  KurumTipi?: string | null;
  kurumTipi?: string | null;
  VergiNo?: string | null;
  vergiNo?: string | null;
  AdresIl?: string | null;
  adresIl?: string | null;
  AdresIlce?: string | null;
  adresIlce?: string | null;
  AktifMi?: boolean | null;
  aktifMi?: boolean | null;
  YetkiliKisi?: string | null;
  yetkiliKisi?: string | null;
  Telefon?: string | null;
  telefon?: string | null;
  Email?: string | null;
  email?: string | null;
  KurulumTercihi?: string | null;
  kurulumTercihi?: string | null;
};

export type Client = {
  id: string;
  numericId: number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  taxNumber?: string;
  transportType: TransportType;
  transportTypeLabel: string;
  setupModel: SetupModel;
  status: EntityStatus;
  setupStatus: WorkflowStatus;
  employeeCount: number;
  stopCount: number;
  routeRequestCount: number;
};

export type CreateClientFormValues = {
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  city: string;
  district: string;
  taxNumber: string;
  transportType: TransportType;
  setupModel: SetupModel;
};

export type CreateClientPayload = CreateClientFormValues;

export type SetupChecklistItem = {
  id: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  href?: string;
};
