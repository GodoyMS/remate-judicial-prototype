import type { AdminAccount, AdminModule, AdminRole, PermissionLevel } from "./types";

export function canAccessModule(
  account: AdminAccount | null,
  role: AdminRole | null,
  module: AdminModule
): boolean {
  if (!account || !account.active) return false;
  if (account.isSuperAdmin) return true;
  if (!role) return false;
  return role.permissions[module] !== "none";
}

export function canReadModule(
  account: AdminAccount | null,
  role: AdminRole | null,
  module: AdminModule
): boolean {
  if (!account || !account.active) return false;
  if (account.isSuperAdmin) return true;
  if (!role) return false;
  const level = role.permissions[module];
  return level === "read" || level === "write";
}

export function canWriteModule(
  account: AdminAccount | null,
  role: AdminRole | null,
  module: AdminModule
): boolean {
  if (!account || !account.active) return false;
  if (account.isSuperAdmin) return true;
  if (!role) return false;
  return role.permissions[module] === "write";
}

export function getEffectivePermission(
  account: AdminAccount | null,
  role: AdminRole | null,
  module: AdminModule
): PermissionLevel {
  if (!account || !account.active) return "none";
  if (account.isSuperAdmin) return "write";
  if (!role) return "none";
  return role.permissions[module];
}

export function getModuleFromPath(pathname: string): AdminModule | null {
  if (pathname === "/admin") return "dashboard";
  if (pathname.startsWith("/admin/analytics")) return "analytics";
  if (pathname.startsWith("/admin/premium-properties")) return "premium_properties";
  if (pathname.startsWith("/admin/properties")) return "properties";
  if (pathname.startsWith("/admin/testimonials")) return "testimonials";
  if (pathname.startsWith("/admin/complaints")) return "complaints";
  if (pathname.startsWith("/admin/chatbot-conversations")) return "chatbot";
  if (pathname.startsWith("/admin/users")) return "users";
  if (pathname.startsWith("/admin/notifications")) return "notifications";
  if (pathname.startsWith("/admin/settings")) return "settings";
  if (pathname.startsWith("/admin/access")) return "access";
  return null;
}
