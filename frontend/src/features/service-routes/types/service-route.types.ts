export type ServiceRouteStatus = "active" | "inactive";

export type ServiceRouteFrequency = "Daily" | "Weekdays" | "On-demand";

export type ServiceRoute = {
  id: string;
  name: string;
  clientName: string;
  status: ServiceRouteStatus;
  stops: number;
  durationMinutes: number;
  distanceKm: number;
  activeRiders: number;
  frequency: ServiceRouteFrequency;
};