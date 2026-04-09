export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "provider";
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "provider" | "admin";
};

export type AuthResponse = {
  message?: string;
  token: string;
  user: AuthUser;
};
