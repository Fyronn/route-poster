export type EmployeeDto = {
  KullaniciId?: number;
  kullaniciId?: number;
  KurumId?: number | null;
  kurumId?: number | null;
  Ad?: string;
  ad?: string;
  Soyad?: string;
  soyad?: string;
  Email?: string | null;
  email?: string | null;
  Telefon?: string | null;
  telefon?: string | null;
  KimlikNo?: string | null;
  kimlikNo?: string | null;
  AktifMi?: boolean | null;
  aktifMi?: boolean | null;
};

export type CorporateEmployee = {
  id: number;
  fullName: string;
  department: string;
  email: string;
  phone: string;
  homeDistrict: string;
  preferredStop: string;
  status: "active" | "inactive" | "pending";
};
