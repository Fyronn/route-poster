import type { Trip } from "../types/trip.types";

export const tripsMockData: Trip[] = [
  {
    id: "TRP-001",
    route: "Downtown - Tech Park",
    vehicle: "BUS-204",
    driver: "John Smith",
    status: "active",
    currentStop: "Stop 3 of 8",
    eta: "10:45 AM",
    riders: {
      current: 24,
      capacity: 35,
    },
    delayMinutes: 0,
  },
  {
    id: "TRP-002",
    route: "University Loop",
    vehicle: "BUS-112",
    driver: "Sarah Johnson",
    status: "active",
    currentStop: "Stop 5 of 6",
    eta: "11:20 AM",
    riders: {
      current: 18,
      capacity: 25,
    },
    delayMinutes: 3,
  },
  {
    id: "TRP-003",
    route: "Industrial Zone - Mall",
    vehicle: "BUS-305",
    driver: "Mike Davis",
    status: "completed",
    currentStop: "Final Stop",
    eta: "Completed",
    riders: {
      current: 31,
      capacity: 40,
    },
    delayMinutes: 0,
  },
  {
    id: "TRP-004",
    route: "Airport Shuttle",
    vehicle: "VAN-021",
    driver: "Emily Chen",
    status: "scheduled",
    currentStop: "Not Started",
    eta: "2:00 PM",
    riders: {
      current: 8,
      capacity: 12,
    },
    delayMinutes: 0,
  },
];