import type { CorporateStopRequest } from "./types";

export const corporateStopsMockData: CorporateStopRequest[] = [
  {
    id: 301,
    stopName: "Kozyatağı Metro",
    address: "Kozyatağı Metro çıkışı, Kadıköy",
    district: "Kadıköy",
    stopType: "both",
    employeeCount: 24,
    status: "requested",
    latitude: 40.9701,
    longitude: 29.0977,
  },
  {
    id: 302,
    stopName: "Çakmak Köprüsü",
    address: "Alemdağ Cad. Çakmak, Ümraniye",
    district: "Ümraniye",
    stopType: "pickup",
    employeeCount: 17,
    status: "approved",
    latitude: 41.0205,
    longitude: 29.1288,
  },
  {
    id: 303,
    stopName: "Yenibosna Metrobüs",
    address: "D-100 Yan Yol, Bahçelievler",
    district: "Bahçelievler",
    stopType: "both",
    employeeCount: 31,
    status: "revision_requested",
    operatorNote: "Durak noktası yoğun trafik nedeniyle 120m taşınmalı.",
  },
];
