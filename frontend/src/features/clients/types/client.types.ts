export type ClientType = "Corporate" | "Educational" | "Commercial";

export type ClientStatus = "active" | "inactive";

export type Client = {
  id: string;
  name: string;
  type: ClientType;
  routeCount: number;
  riderCount: number;
  contactPerson: string;
  contactEmail: string;
  status: ClientStatus;
};