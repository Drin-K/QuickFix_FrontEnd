import { api } from "@/api/api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

export const authService = {
  login: (payload: LoginPayload) => api.post<AuthResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload),

  getProfile: (token: string) =>
    api.get<AuthResponse["user"]>("/auth/me", {
      token,
    }),
};
