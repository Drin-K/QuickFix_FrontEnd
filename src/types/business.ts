export type ProviderVerificationStatus = "pending" | "verified" | "rejected";

export type ServiceStatus = "draft" | "active" | "archived";

export type ClientProfile = {
  id: string;
  userId: string;
  tenantId: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  preferredLanguage?: string;
};

export type ProviderProfile = {
  id: string;
  userId: string;
  tenantId: string;
  displayName: string;
  bio?: string;
  categoryIds: string[];
  serviceIds: string[];
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
  verificationStatus: ProviderVerificationStatus;
  cityId?: string;
  addressId?: string;
};

export type Company = {
  id: string;
  tenantId: string;
  name: string;
  businessNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressId?: string;
};

export type Category = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentCategoryId?: string;
};

export type MarketplaceService = {
  id: string;
  tenantId: string;
  providerId: string;
  categoryId: string;
  title: string;
  description: string;
  basePrice?: number;
  currency?: string;
  durationMinutes?: number;
  status: ServiceStatus;
};
