export type UserRole = "admin" | "provider" | "client" | "manager" | "support";

export type TenantStatus = "active" | "inactive" | "suspended";

export type UserStatus = "active" | "invited" | "blocked";

export type RolePermission =
  | "users.read"
  | "users.write"
  | "providers.read"
  | "providers.write"
  | "bookings.read"
  | "bookings.write"
  | "reports.read"
  | "tenants.manage";

export type Role = {
  id: string;
  name: UserRole | string;
  description?: string;
  permissions: RolePermission[];
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  tenantId: string;
  roleId?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};
