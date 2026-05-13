export type CorporateRouteRequest = {
  routeId: number;
  clientId?: number | null;
  routeName?: string | null;
  status?: string | null;
  shiftType?: string | null;
  direction?: string | null;
  operatingDays?: string | null;
  plannedStartTime?: string | null;
  estimatedDurationMinutes?: number | null;
  isActive?: boolean | null;
  
  // UI Specific optional fields
  clientName?: string;
  startPoint?: string;
  endPoint?: string;
  stopCount?: number;
  employeeCount?: number;
  estimatedDistanceKm?: number;
  plannedStops?: RouteRequestStopPlan[];
};

export type RouteRequestStopPlan = {
  stopId: number;
  stopName: string;
  sequence: number;
  estimatedArrivalTime?: string;
};
