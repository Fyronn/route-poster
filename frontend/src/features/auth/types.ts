export type AuthUserDto = {
  KullaniciId?: number;
  kullaniciId?: number;
  KurumId?: number | null;
  kurumId?: number | null;
  RolId?: number | null;
  rolId?: number | null;
  Ad?: string;
  ad?: string;
  Soyad?: string;
  soyad?: string;
  Email?: string;
  email?: string;
  RolAdi?: string | null;
  rolAdi?: string | null;
};

export type AuthResponseDto = {
  Token?: string;
  token?: string;
  User?: AuthUserDto;
  user?: AuthUserDto;
};

export type AuthUser = {
  id: number;
  clientId: number | null;
  roleId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string | null;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterUserPayload = {
  clientId?: number | null;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId?: number | null;
};
