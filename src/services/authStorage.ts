import type { AuthResponse, AuthUser } from "./authApi";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_USER_KEY = "authUser";

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

export const clearAuthSession = () => {
  clearAccessToken();
  clearAuthUser();
};

export const saveAuthSession = (response: AuthResponse) => {
  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }

  if (response.user) {
    setAuthUser(response.user);
  }
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAccessToken());
};
