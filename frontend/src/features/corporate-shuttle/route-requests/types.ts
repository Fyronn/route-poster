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
  stopIds?: number[] | null;
  passengerIds?: number[] | null;
  passengers?: RoutePassengerDto[] | null;
  stops?: RouteStopDto[] | null;
  
  // UI Specific optional fields
  clientName?: string;
  startPoint?: string;
  endPoint?: string;
  stopCount?: number;
  employeeCount?: number;
  estimatedDistanceKm?: number;
  plannedStops?: RouteRequestStopPlan[];
  selectedPassengers?: RouteRequestPassenger[];
  comments?: string | null;
  decisionNote?: string | null;
  operatorNote?: string | null;
  rejectionReason?: string | null;
  rejectReason?: string | null;
};

export type RouteStopDto = {
  stopId: number;
  stopName?: string | null;
  stopOrder?: number | null;
};

export type RoutePassengerDto = {
  passengerId: number;
  fullName?: string | null;
};

export type RouteRequestStopPlan = {
  stopId: number;
  stopName: string;
  sequence: number;
  estimatedArrivalTime?: string;
};

export type RouteRequestPassenger = {
  passengerId: number;
  passengerName: string;
};
