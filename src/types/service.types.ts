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
