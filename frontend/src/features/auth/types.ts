export type AuthUserDto = {
  userId?: number;
  clientId?: number | null;
  roleId?: number | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  roleName?: string | null;
};

export type AuthResponseDto = {
  token?: string;
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
