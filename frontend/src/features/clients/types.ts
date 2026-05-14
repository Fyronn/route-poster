import type {
  EntityStatus,
  SetupModel,
  TransportType,
  WorkflowStatus,
} from "@/types/common";

export type Client = {
  clientId: number;
  clientName: string;
  clientType?: string | null;
  taxNumber?: string | null;
  city?: string | null;
  district?: string | null;
  isActive?: boolean;
  authorizedPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  setupPreference?: string | null;
  
  // UI Specific fallback properties that are populated locally or optionally
  setupStatus?: WorkflowStatus;
  employeeCount?: number;
  stopCount?: number;
  routeRequestCount?: number;
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
