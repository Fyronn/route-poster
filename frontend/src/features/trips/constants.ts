import type { Trip } from "./types";

export const tripsMockData: Trip[] = [
  {
    tripId: 8001,
    routeId: 1,
    date: "2026-05-08",
    time: "07:10",
    routeName: "Avrupa Yakası Sabah Servisi",
    vehicle: "34 ABC 204",
    driver: "Mehmet Kaya",
    status: "completed",
    isActive: true,
  },
  {
    tripId: 8002,
    routeId: 2,
    date: "2026-05-08",
    time: "07:00",
    routeName: "Anadolu Yakası Sabah Servisi",
    vehicle: "34 DEF 112",
    driver: "Serkan Yılmaz",
    status: "started",
    isActive: true,
  },
  {
    tripId: 8003,
    routeId: 3,
    date: "2026-05-08",
    time: "18:15",
    routeName: "Ataşehir Akşam Dönüş",
    vehicle: "34 GHI 021",
    driver: "Derya Şahin",
    status: "planned",
    isActive: true,
  },
];
