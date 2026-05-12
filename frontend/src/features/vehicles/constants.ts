import type { Vehicle } from "./types";

export const vehiclesMockData: Vehicle[] = [
  {
    id: 301,
    plate: "34 ABC 123",
    capacity: 27,
    model: "Mercedes Sprinter",
    productionYear: 2022,
    vehicleType: "Midibus",
    equipment: "Klima, kamera",
    status: "active",
  },
  {
    id: 302,
    plate: "34 XYZ 456",
    capacity: 46,
    model: "Temsa Prestij",
    productionYear: 2021,
    vehicleType: "Otobus",
    equipment: "Klima, takip cihazi",
    status: "active",
  },
];
