export type Trip = {
  tripId: number;
  tripName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  origin?: string | null;
  destination?: string | null;
  status?: string | null;
  vehicleId?: number | null;
  driverId?: number | null;
  routeId?: number | null;
  isActive?: boolean | null;

  // Optional fields for UI / mock consistency
  routeName?: string;
  vehicle?: string;
  driver?: string;
  date?: string;
  time?: string;
};
