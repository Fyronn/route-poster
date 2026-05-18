export type Trip = {
  tripId: number;
  routeId?: number | null;
  tripDate: string;
  startTime?: string | null;
  endTime?: string | null;
  status?: string | null;
};

export type TripAssignment = {
  id: number;
  tripId: number;
  vehicleId: number;
  driverId: number;
  tripDate?: string | null;
  vehiclePlateNumber?: string | null;
  driverFirstName?: string | null;
  driverLastName?: string | null;
  serviceSupervisorId?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: number | null;
};

export type CreateTripDto = {
  routeId: number;
  tripDate: string;
  startTime?: string | null;
  endTime?: string | null;
};

export type CreateTripAssignmentDto = {
  tripId: number;
  vehicleId: number;
  driverId: number;
  serviceSupervisorId?: number | null;
  createdBy?: number | null;
};
