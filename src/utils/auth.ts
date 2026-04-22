import type { AuthResponse, AuthUser } from "@/services/auth.service";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_USER_KEY = "authUser";
const ACTIVE_TENANT_ID_KEY = "activeTenantId";

type JwtPayload = {
  exp?: number;
};

const decodeBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  return atob(padded);
};

const parseJwtPayload = (token: string): JwtPayload | null => {
  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const json = decodeBase64Url(parts[1]);
    const parsed = JSON.parse(json) as unknown;

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    return parsed as JwtPayload;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtPayload(token);

  if (!payload || typeof payload.exp !== "number") {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds;
};

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const setAuthUser = (user: AuthUser) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const getAuthUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};

export const setActiveTenantId = (tenantId: number) => {
  localStorage.setItem(ACTIVE_TENANT_ID_KEY, String(tenantId));
};

export const getStoredTenantId = (): number | null => {
  const storedTenantId = localStorage.getItem(ACTIVE_TENANT_ID_KEY);

  if (!storedTenantId) {
    return null;
  }

  const tenantId = Number(storedTenantId);

  if (!Number.isInteger(tenantId) || tenantId <= 0) {
    localStorage.removeItem(ACTIVE_TENANT_ID_KEY);
    return null;
  }

  return tenantId;
};

export const getActiveTenantId = (): number | null => {
  const authUser = getAuthUser();

  if (authUser?.tenantId) {
    return authUser.tenantId;
  }

  return getStoredTenantId();
};

export const clearActiveTenantId = () => {
  localStorage.removeItem(ACTIVE_TENANT_ID_KEY);
};

export const clearAuthSession = () => {
  clearAccessToken();
  clearAuthUser();
  clearActiveTenantId();
};

export const getValidAccessToken = (): string | null => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearAuthSession();
    return null;
  }

  return token;
};

export const saveAuthSession = (response: AuthResponse) => {
  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }

  if (response.user) {
    setAuthUser(response.user);

    if (response.user.tenantId) {
      setActiveTenantId(response.user.tenantId);
    }
  }
};

export const isAuthenticated = (): boolean => {
  return Boolean(getValidAccessToken());
};
