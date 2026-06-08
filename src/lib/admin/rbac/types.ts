export const ADMIN_MODULES = [
  "dashboard",
  "analytics",
  "properties",
  "premium_properties",
  "testimonials",
  "complaints",
  "chatbot",
  "users",
  "notifications",
  "settings",
  "access",
] as const;

export type AdminModule = (typeof ADMIN_MODULES)[number];

export type PermissionLevel = "none" | "read" | "write";

export type ModulePermissions = Record<AdminModule, PermissionLevel>;

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  permissions: ModulePermissions;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  isSuperAdmin: boolean;
  active: boolean;
  avatar?: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface AdminSession {
  accountId: string;
  email: string;
  loggedInAt: string;
}
