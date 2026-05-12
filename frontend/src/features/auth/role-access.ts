import { ADMIN_ROLE_IDS, SERVICE_MANAGER_ROLE_ID } from "./constants";
import type { AuthUser } from "./types";

export type AppAccessRole = "admin" | "service-manager" | "unknown";

const ADMIN_ROLE_ID_SET = new Set<number>(ADMIN_ROLE_IDS);

export function resolveRoleIdFromRoleText(value?: string | null) {
  if (!value) return null;

  const normalized = value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/_/g, " ");
  const numeric = Number(normalized);

  if (Number.isFinite(numeric)) return numeric;

  if (
    normalized.includes("servis yoneticisi") ||
    normalized.includes("servis yöneticisi") ||
    normalized.includes("servis") ||
    normalized.includes("hostes")
  ) {
    return SERVICE_MANAGER_ROLE_ID;
  }

  if (
    normalized.includes("sys admin") ||
    normalized.includes("sistem yoneticisi") ||
    normalized.includes("sistem yöneticisi")
  ) {
    return ADMIN_ROLE_IDS[0];
  }

  if (
    normalized.includes("turizm admin") ||
    normalized.includes("turizm firma yoneticisi") ||
    normalized.includes("turizm firma yöneticisi")
  ) {
    return ADMIN_ROLE_IDS[1];
  }

  if (
    normalized.includes("turizm operator") ||
    normalized.includes("operasyon sorumlusu")
  ) {
    return ADMIN_ROLE_IDS[2];
  }

  return null;
}

export function normalizeAuthUserRole(user: AuthUser): AuthUser {
  return {
    ...user,
    roleId: user.roleId ?? resolveRoleIdFromRoleText(user.roleName),
  };
}

export function isAdminRoleId(roleId: number | null | undefined) {
  return typeof roleId === "number" && ADMIN_ROLE_ID_SET.has(roleId);
}

export function isServiceManagerRoleId(roleId: number | null | undefined) {
  return roleId === SERVICE_MANAGER_ROLE_ID;
}

export function getAppAccessRole(user: AuthUser): AppAccessRole {
  if (isServiceManagerRoleId(user.roleId)) return "service-manager";
  if (isAdminRoleId(user.roleId)) return "admin";

  return "unknown";
}

export function isAdminUserRole(user: AuthUser) {
  return getAppAccessRole(user) === "admin";
}

export function isServiceManagerUserRole(user: AuthUser) {
  return getAppAccessRole(user) === "service-manager";
}

export function getDefaultPathForUser(user: AuthUser) {
  const role = getAppAccessRole(user);

  if (role === "service-manager" && user.clientId) {
    return "/admin/corporate-shuttle/employees";
  }

  if (role === "admin") {
    return "/admin";
  }

  return null;
}
