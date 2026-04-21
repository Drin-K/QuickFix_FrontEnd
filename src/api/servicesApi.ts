import { api } from "@/api/api";
import type { ServiceApiDetails } from "@/types/service.types";

export type ServiceApiListItem = {
  id: number;
  tenantId: number;
  title: string;
  description: string | null;
  basePrice: string;
  isActive: boolean;
};

type GetServicesParams = {
  tenantId?: number | null;
};

export const getServices = ({
  tenantId,
}: GetServicesParams = {}): Promise<ServiceApiListItem[]> =>
  api.get<ServiceApiListItem[]>("/services", {
    tenantId,
  });

export const getServiceById = (
  serviceId: number,
  tenantId?: number | null,
): Promise<ServiceApiDetails> =>
  api.get<ServiceApiDetails>(`/services/${serviceId}`, {
    tenantId,
  });
