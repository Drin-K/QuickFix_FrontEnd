import { api } from "@/api/api";
import type { AuthUser } from "@/services/auth.service";

export type MeResponse = AuthUser & {
  phone?: string | null;
  tenant?: { id: number; name: string } | null;
  provider?: {
    id: number;
    type: "company" | "individual";
    displayName: string;
    description: string | null;
    cityId: number | null;
    address: string | null;
    isVerified: boolean;
    averageRating: string | null;
  } | null;
};

export const getMe = (): Promise<MeResponse> =>
  api.get<MeResponse>("/users/me", { requireAuth: true });
