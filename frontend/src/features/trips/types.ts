export type TripDto = {
  SeferId?: number;
  seferId?: number;
  RotaId?: number | null;
  rotaId?: number | null;
  SeferTarihi?: string;
  seferTarihi?: string;
  BaslamaZamani?: string | null;
  baslamaZamani?: string | null;
  BitisZamani?: string | null;
  bitisZamani?: string | null;
  Statu?: string | null;
  statu?: string | null;
};

export type Trip = {
  id: number;
  routeId: number | null;
  date: string;
  time: string;
  routeName: string;
  vehicle: string;
  driver: string;
  status: "planned" | "started" | "completed" | "cancelled";
};
