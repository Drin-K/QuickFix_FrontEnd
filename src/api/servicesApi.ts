import { api } from "@/api/api";
import type { ServiceApiDetails } from "@/types/service.types";

export const getServiceById = (
  serviceId: number,
  tenantId?: number | null,
): Promise<ServiceApiDetails> =>
  api.get<ServiceApiDetails>(`/services/${serviceId}`, {
    tenantId,
  });
