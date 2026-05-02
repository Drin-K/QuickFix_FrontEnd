export type ServiceCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type Statistic = {
  label: string;
  value: string;
};

export type ProviderHighlight = {
  name: string;
  specialty: string;
  rating: number;
  city: string;
};

export type ServiceApiListItem = {
  id: number;
  tenantId: number;
  title: string;
  description: string | null;
  basePrice: string;
  isActive: boolean;
  category: {
    id: number;
    name: string;
  } | null;
  provider: {
    id: number;
    displayName: string;
    description: string | null;
  } | null;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ServicesApiListResponse = {
  services: ServiceApiListItem[];
};

export type ServiceApiCategory = {
  id: number;
  name: string;
  description: string | null;
};

export type CategoriesApiResponse = {
  categories: ServiceApiCategory[];
};

export type ServiceApiDetails = {
  id: number;
  tenantId: number;
  provider: {
    id: number;
    displayName: string;
    description: string | null;
  };
  category: {
    id: number;
    name: string;
  };
  title: string;
  description: string | null;
  basePrice: string;
  isActive: boolean;
  images: Array<{
    id: number;
    imageUrl: string;
    sortOrder: number;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type ServiceMutationPayload = {
  title: string;
  description: string | null;
  basePrice: string;
  categoryId: number;
  isActive: boolean;
  coverImageUrl?: string | null;
};
