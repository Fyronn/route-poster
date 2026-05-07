export type TripStatus = "active" | "completed" | "scheduled";

export type Trip = {
  id: string;
  route: string;
  vehicle: string;
  driver: string;
  status: TripStatus;
  currentStop: string;
  eta: string;
  riders: {
    current: number;
    capacity: number;
  };
  delayMinutes: number;
};