export type VehicleStatus =
  | "active"
  | "available"
  | "scheduled"
  | "maintenance";

export type VehicleType = "Bus" | "Van";

export type Vehicle = {
  id: string;
  type: VehicleType;
  capacity: string;
  status: VehicleStatus;
  driver: string;
  currentTrip: string;
  location: string;
  lastMaintenance: string;
};