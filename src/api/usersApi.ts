import { api } from "@/api/api";
import type { AuthUser } from "@/services/auth.service";

export const getMe = (): Promise<AuthUser> => api.get<AuthUser>("/users/me");

