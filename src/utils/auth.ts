import type { AuthResponse, AuthUser } from "@/services/auth.service";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_USER_KEY = "authUser";
const ACTIVE_TENANT_ID_KEY = "activeTenantId";

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
  return Boolean(getAccessToken());
};
