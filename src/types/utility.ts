export type Address = {
  id: string;
  label?: string;
  street: string;
  building?: string;
  postalCode?: string;
  cityId: string;
  latitude?: number;
  longitude?: number;
};

export type City = {
  id: string;
  name: string;
  countryCode: string;
  region?: string;
};

export type Favorite = {
  id: string;
  userId: string;
  providerId?: string;
  serviceId?: string;
  createdAt: string;
};

export type ReportReason =
  | "spam"
  | "abuse"
  | "fraud"
  | "inappropriate_content"
  | "other";

export type Report = {
  id: string;
  reporterId: string;
  targetType: "user" | "provider" | "service" | "review" | "booking";
  targetId: string;
  reason: ReportReason;
  description?: string;
  createdAt: string;
};
