import { api } from "./api";

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

export type AuthResponse = {
  message: string;
  accessToken?: string;
  user?: unknown;
};

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  api.post<AuthResponse>("/auth/login", {
    body: payload,
  });

export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
  api.post<AuthResponse>("/auth/register", {
    body: payload,
  });
