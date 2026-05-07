export type DriverStatus = "on-trip" | "available" | "scheduled";

export type Driver = {
  id: string;
  name: string;
  contact: string;
  status: DriverStatus;
  currentVehicle: string;
  tripsToday: number;
  rating: number;
  licenseExpiry: string;
};