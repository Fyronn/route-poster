import type { ShuttlePlanRequest } from "./types";

export const shuttlePlanRequestsMockData: ShuttlePlanRequest[] = [
  {
    id: 9001,
    clientName: "TechCorp Inc.",
    submittedBy: "Jane Wilson",
    submittedAt: "2026-05-08T10:30:00",
    employeeCount: 184,
    stopCount: 36,
    routeCount: 7,
    summary:
      "İstanbul Avrupa ve Anadolu yakası sabah/akşam personel servis planı.",
    status: "requested",
  },
  {
    id: 9002,
    clientName: "Anka Finans",
    submittedBy: "Mert Kaya",
    submittedAt: "2026-05-07T15:45:00",
    employeeCount: 92,
    stopCount: 21,
    routeCount: 4,
    summary:
      "Ataşehir merkezli sabah geliş ve akşam dönüş servis planı reddedildi.",
    status: "rejected",
  },
  {
    id: 9003,
    clientName: "Nova Üretim A.Ş.",
    submittedBy: "Elif Arslan",
    submittedAt: "2026-05-06T09:15:00",
    employeeCount: 248,
    stopCount: 44,
    routeCount: 11,
    summary: "Kemalpaşa fabrika vardiya servisleri için onaylanmış plan.",
    status: "approved",
  },
];
