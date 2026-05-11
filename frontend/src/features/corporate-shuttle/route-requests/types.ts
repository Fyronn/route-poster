export type RouteRequestDto = {
  RotaId?: number;
  rotaId?: number;
  KurumId?: number | null;
  kurumId?: number | null;
  RotaAdi?: string | null;
  rotaAdi?: string | null;
  Statu?: string | null;
  statu?: string | null;
  VardiyaTipi?: string | null;
  vardiyaTipi?: string | null;
  Yon?: string | null;
  yon?: string | null;
  CalismaGunleri?: string | null;
  calismaGunleri?: string | null;
  PlanlananBaslangicSaati?: string | null;
  planlananBaslangicSaati?: string | null;
  TahminiSureDakika?: number | null;
  tahminiSureDakika?: number | null;
  AktifMi?: boolean | null;
  aktifMi?: boolean | null;
};

export type CorporateRouteRequest = {
  id: number;
  clientName: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  direction: string;
  shift: string;
  workingDays: string;
  plannedStartTime: string;
  stopCount: number;
  employeeCount: number;
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  status:
    | "requested"
    | "submitted"
    | "approved"
    | "rejected"
    | "revision_requested";
};
