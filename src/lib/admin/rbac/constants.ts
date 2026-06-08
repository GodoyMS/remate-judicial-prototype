import type { AdminModule, ModulePermissions } from "./types";

export const MODULE_LABELS: Record<AdminModule, string> = {
  dashboard: "Dashboard",
  analytics: "Analítica",
  properties: "Propiedades",
  premium_properties: "Premium",
  testimonials: "Testimonios",
  complaints: "Reclamaciones",
  chatbot: "Chatbot",
  users: "Usuarios",
  notifications: "Notificaciones",
  settings: "Configuración",
  access: "Gestión de accesos",
};

export const MODULE_DESCRIPTIONS: Record<AdminModule, string> = {
  dashboard: "Vista general de KPIs y actividad",
  analytics: "Reportes y métricas avanzadas",
  properties: "CRUD de propiedades estándar",
  premium_properties: "Gestión de propiedades premium",
  testimonials: "Testimonios de inversores",
  complaints: "Libro de reclamaciones",
  chatbot: "Conversaciones del chatbot",
  users: "Inversores y verificaciones KYC",
  notifications: "Centro de alertas del backoffice",
  settings: "Preferencias de cuenta y seguridad",
  access: "Roles, permisos y administradores",
};

export const MODULE_ROUTES: Record<AdminModule, string> = {
  dashboard: "/admin",
  analytics: "/admin/analytics",
  properties: "/admin/properties",
  premium_properties: "/admin/premium-properties",
  testimonials: "/admin/testimonials",
  complaints: "/admin/complaints",
  chatbot: "/admin/chatbot-conversations",
  users: "/admin/users",
  notifications: "/admin/notifications",
  settings: "/admin/settings",
  access: "/admin/access",
};

export const PERMISSION_LABELS = {
  none: "Sin acceso",
  read: "Solo lectura",
  write: "Acceso completo",
} as const;

export const PERMISSION_COLORS = {
  none: "bg-muted text-muted-foreground",
  read: "bg-sky-50 text-sky-700 border-sky-200",
  write: "bg-emerald-50 text-emerald-700 border-emerald-200",
} as const;

export function createEmptyPermissions(): ModulePermissions {
  return {
    dashboard: "none",
    analytics: "none",
    properties: "none",
    premium_properties: "none",
    testimonials: "none",
    complaints: "none",
    chatbot: "none",
    users: "none",
    notifications: "none",
    settings: "none",
    access: "none",
  };
}

export function createFullWritePermissions(): ModulePermissions {
  const perms = createEmptyPermissions();
  for (const key of Object.keys(perms) as AdminModule[]) {
    perms[key] = "write";
  }
  return perms;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
