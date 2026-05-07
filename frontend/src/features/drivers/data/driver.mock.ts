import type { Driver } from "../types/driver.types";

export const driversMockData: Driver[] = [
  {
    id: "DRV-001",
    name: "John Smith",
    contact: "+1 (555) 123-4567",
    status: "on-trip",
    currentVehicle: "BUS-204",
    tripsToday: 2,
    rating: 4.8,
    licenseExpiry: "2027-08-15",
  },
  {
    id: "DRV-002",
    name: "Sarah Johnson",
    contact: "+1 (555) 234-5678",
    status: "on-trip",
    currentVehicle: "BUS-112",
    tripsToday: 3,
    rating: 4.9,
    licenseExpiry: "2027-11-20",
  },
  {
    id: "DRV-003",
    name: "Mike Davis",
    contact: "+1 (555) 345-6789",
    status: "available",
    currentVehicle: "-",
    tripsToday: 2,
    rating: 4.7,
    licenseExpiry: "2026-12-10",
  },
  {
    id: "DRV-004",
    name: "Emily Chen",
    contact: "+1 (555) 456-7890",
    status: "scheduled",
    currentVehicle: "VAN-021",
    tripsToday: 0,
    rating: 5,
    licenseExpiry: "2028-03-05",
  },
];