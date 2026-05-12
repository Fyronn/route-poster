export type VehicleDto = {
  AracId?: number;
  aracId?: number;
  TurizmFirmaId?: number | null;
  turizmFirmaId?: number | null;
  Plaka?: string;
  plaka?: string;
  Kapasite?: number;
  kapasite?: number;
  MarkaModel?: string | null;
  markaModel?: string | null;
  UretimYili?: number | null;
  uretimYili?: number | null;
  AracTipi?: string | null;
  aracTipi?: string | null;
  DonanimOzellikleri?: string | null;
  donanimOzellikleri?: string | null;
  AktifMi?: boolean | null;
  aktifMi?: boolean | null;
};

export type Vehicle = {
  id: number;
  plate: string;
  capacity: number;
  model: string;
  productionYear?: number;
  vehicleType: string;
  equipment?: string;
  status: "active" | "inactive";
};
