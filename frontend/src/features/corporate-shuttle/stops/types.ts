export type StopRequestDto = {
  DurakId?: number;
  durakId?: number;
  KurumId?: number | null;
  kurumId?: number | null;
  DurakAdi?: string | null;
  durakAdi?: string | null;
  Adres?: string | null;
  adres?: string | null;
  Enlem?: number | null;
  enlem?: number | null;
  Boylam?: number | null;
  boylam?: number | null;
  Statu?: string | null;
  statu?: string | null;
  OperatorNotu?: string | null;
  operatorNotu?: string | null;
  AktifMi?: boolean | null;
  aktifMi?: boolean | null;
};

export type CorporateStopRequest = {
  id: number;
  stopName: string;
  address: string;
  district: string;
  stopType: "pickup" | "dropoff" | "both";
  employeeCount: number;
  status: "requested" | "approved" | "rejected" | "revision_requested";
  latitude?: number;
  longitude?: number;
  operatorNote?: string;
};
