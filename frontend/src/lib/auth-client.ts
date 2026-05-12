"use client";

import {
  AUTH_TOKEN_COOKIE,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_COOKIE,
  AUTH_USER_STORAGE_KEY,
} from "@/features/auth/constants";
import type { AuthSession } from "@/features/auth/types";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function saveAuthSession(session: AuthSession) {
  const encodedUser = encodeURIComponent(JSON.stringify(session.user));

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.token);
  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(session.user));

  setCookie(AUTH_TOKEN_COOKIE, session.token);
  setCookie(AUTH_USER_COOKIE, encodedUser);
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);

  deleteCookie(AUTH_TOKEN_COOKIE);
  deleteCookie(AUTH_USER_COOKIE);
}

export function getStoredAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}
