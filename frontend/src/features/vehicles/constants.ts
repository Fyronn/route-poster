import type { Vehicle } from "./types";

export const vehiclesMockData: Vehicle[] = [
  {
    vehicleId: 301,
    plateNumber: "34 ABC 123",
    capacity: 27,
    brandModel: "Mercedes Sprinter",
    productionYear: 2022,
    vehicleType: "Midibus",
    equipmentFeatures: "Klima, kamera",
    isActive: true,
  },
  {
    vehicleId: 302,
    plateNumber: "34 XYZ 456",
    capacity: 46,
    brandModel: "Temsa Prestij",
    productionYear: 2021,
    vehicleType: "Otobus",
    equipmentFeatures: "Klima, takip cihazi",
    isActive: true,
  },
];
