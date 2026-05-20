import { postRequest } from "@/lib/api";

import { resolveRoleIdFromRoleText } from "../role-access";
import type {
  AuthResponseDto,
  AuthSession,
  AuthUser,
  AuthUserDto,
  LoginCredentials,
  RegisterUserPayload,
} from "../types";

const ROLE_CLAIM_KEYS = [
  "role",
  "Role",
  "rol",
  "Rol",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
];

function mapAuthUserDto(dto: AuthUserDto): AuthUser {
  return {
    id: dto.userId ?? 0,
    clientId: dto.clientId ?? null,
    roleId: dto.roleId ?? null,
    firstName: dto.firstName ?? "",
    lastName: dto.lastName ?? "",
    email: dto.email ?? "",
    roleName: dto.roleName ?? null,
  };
}

function decodeJwtClaims(token: string): Record<string, unknown> {
  try {
    const [, payload] = token.split(".");
    if (!payload) return {};

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(paddedBase64)) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function readNumericClaim(
  claims: Record<string, unknown>,
  key: string,
): number | null {
  const value = claims[key];

  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readStringClaim(
  claims: Record<string, unknown>,
  key: string,
): string | null {
  const value = claims[key];

  return typeof value === "string" && value.trim() ? value : null;
}

function readRoleIdFromClaims(claims: Record<string, unknown>) {
  const numericRoleId =
    readNumericClaim(claims, "rolId") ??
    readNumericClaim(claims, "RolId") ??
    readNumericClaim(claims, "roleId") ??
    readNumericClaim(claims, "RoleId");

  if (numericRoleId) return numericRoleId;

  for (const key of ROLE_CLAIM_KEYS) {
    const roleId = resolveRoleIdFromRoleText(readStringClaim(claims, key));

    if (roleId) return roleId;
  }

  return null;
}

function mapAuthResponseDto(dto: AuthResponseDto): AuthSession {
  const token = dto.token;
  const user = dto.user;

  if (!token || !user) {
    throw new Error("Auth response token veya user bilgisi icermiyor.");
  }

  const mappedUser = mapAuthUserDto(user);
  const claims = decodeJwtClaims(token);
  const clientId =
    mappedUser.clientId ??
    readNumericClaim(claims, "kurumId") ??
    readNumericClaim(claims, "KurumId") ??
    readNumericClaim(claims, "clientId") ??
    readNumericClaim(claims, "ClientId");
  const roleId =
    mappedUser.roleId ??
    readRoleIdFromClaims(claims) ??
    resolveRoleIdFromRoleText(mappedUser.roleName);

  return {
    token,
    user: {
      ...mappedUser,
      clientId,
      roleId,
    },
  };
}

export async function login(credentials: LoginCredentials) {
  const response = await postRequest<AuthResponseDto>(
    "/api/Auth/login",
    {
      email: credentials.email,
      password: credentials.password,
    },
    { skipAuth: true },
  );

  return mapAuthResponseDto(response);
}

export async function registerUser(payload: RegisterUserPayload) {
  const response = await postRequest<AuthResponseDto>(
    "/api/Auth/register",
    {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      roleId: payload.roleId,
      clientId: payload.clientId,
      transportCompanyId:payload.transportCompanyId,
      departmentId:payload.departmentId,
      identityNumber:payload.identityNumber,
      phone:payload.phone

    },
    { skipAuth: true },
  );

  return mapAuthResponseDto(response);
}
