export type DriverDto = {
  KullaniciId?: number;
  kullaniciId?: number;
  KimlikNo?: string | null;
  kimlikNo?: string | null;
  Ad?: string;
  ad?: string;
  Soyad?: string;
  soyad?: string;
  Email?: string | null;
  email?: string | null;
  Telefon?: string | null;
  telefon?: string | null;
  AktifMi?: boolean | null;
  aktifMi?: boolean | null;
};

export type Driver = {
  id: number;
  identityNumber?: string;
  fullName: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
};
