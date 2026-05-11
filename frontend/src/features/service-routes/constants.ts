import type { ServiceRoute } from "./types";

export const serviceRoutesMockData: ServiceRoute[] = [
  {
    id: 501,
    routeName: "Avrupa Yakası Sabah Servisi",
    clientName: "TechCorp Inc.",
    vehicle: "34 ABC 204",
    driver: "Mehmet Kaya",
    stopCount: 8,
    employeeCount: 46,
    workingDays: "Pzt - Cum",
    status: "active",
  },
  {
    id: 502,
    routeName: "Anadolu Yakası Sabah Servisi",
    clientName: "TechCorp Inc.",
    vehicle: "34 DEF 112",
    driver: "Serkan Yılmaz",
    stopCount: 9,
    employeeCount: 58,
    workingDays: "Pzt - Cum",
    status: "planned",
  },
  {
    id: 503,
    routeName: "Kemalpaşa Fabrika Gidiş",
    clientName: "Nova Üretim A.Ş.",
    vehicle: "35 KMP 305",
    driver: "Can Ergin",
    stopCount: 11,
    employeeCount: 72,
    workingDays: "Pzt - Cmt",
    status: "active",
  },
];
