import { api } from "@/api/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  accountType: "client" | "provider";
};

export type AuthUserRole = "client" | "provider" | "admin" | "platform_admin";

export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  role: AuthUserRole;
  tenantId: number | null;
};

export type AuthResponse = {
  message: string;
  accessToken?: string;
  user?: AuthUser;
};

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  api.post<AuthResponse>("/auth/login", {
    body: payload,
  });

export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
  api.post<AuthResponse>("/auth/register", {
    body: payload,
  });
