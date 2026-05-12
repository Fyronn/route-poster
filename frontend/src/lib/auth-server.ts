import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AUTH_TOKEN_COOKIE,
  AUTH_USER_COOKIE,
} from "@/features/auth/constants";
import {
  isAdminUserRole,
  isServiceManagerUserRole,
  normalizeAuthUserRole,
} from "@/features/auth/role-access";
import type { AuthSession, AuthUser } from "@/features/auth/types";

function parseAuthUser(value?: string): AuthUser | null {
  if (!value) return null;

  try {
    return normalizeAuthUserRole(
      JSON.parse(decodeURIComponent(value)) as AuthUser,
    );
  } catch {
    return null;
  }
}

export async function getServerAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) return null;

  const user = parseAuthUser(cookieStore.get(AUTH_USER_COOKIE)?.value);

  if (!user) return null;

  return { token, user };
}

export async function requireServerAuthSession() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export function isServiceManager(user: AuthUser) {
  return isServiceManagerUserRole(user);
}

export function isAdminUser(user: AuthUser) {
  return isAdminUserRole(user);
}

export function getScopedClientId(session: AuthSession, fallbackClientId = 1) {
  if (isServiceManager(session.user) && session.user.clientId) {
    return session.user.clientId;
  }

  return fallbackClientId;
}

export function ensureAdminAccess(session: AuthSession) {
  if (!isAdminUser(session.user)) {
    redirect("/unauthorized");
  }
}

export function ensureServiceManagerAccess(session: AuthSession) {
  if (!isServiceManager(session.user) || !session.user.clientId) {
    redirect("/unauthorized");
  }
}
