export type CorporateStopRequest = {
  stopId: number;
  clientId?: number | null;
  stopName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean | null;
  
  // Optional properties for mock data/UI until fully integrated
  address?: string;
  district?: string;
  stopType?: "pickup" | "dropoff" | "both";
  employeeCount?: number;
  status?: "requested" | "approved" | "rejected" | "revision_requested";
  operatorNote?: string;
};
