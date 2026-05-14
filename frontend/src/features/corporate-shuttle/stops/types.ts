export type CorporateStopRequest = {
  stopId?: number | null;
  clientId?: number | null;
  stopName?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean | null;
  

  district?: string | null;
  stopType?: "pickup" | "dropoff" | "both";
  employeeCount?: number | null;
  status?: string | null;
  operatorNote?: string | null;
};


export type CorporateStopUpdate = Omit<CorporateStopRequest,
"stopId"|"isActive"|"district"|"stopType"|"employeeCount"|"status">

export type CorporateStopUpdate2 = Pick<CorporateStopRequest,
"stopId"|"clientId"|"stopName"|"address"|"latitude"|"longitude"|"operatorNote">
