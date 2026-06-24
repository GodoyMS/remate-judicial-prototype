import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  MessageSquareQuote,
  BarChart3,
  BookOpen,
  Bot,
  Crown,
  Bell,
  KeyRound,
  ArrowDownToLine,
  type LucideIcon,
} from "lucide-react";
import type { AdminModule } from "@/lib/admin/rbac/types";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  module: AdminModule;
  exact?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, module: "dashboard", exact: true },
  { href: "/admin/analytics", label: "Analítica", icon: BarChart3, module: "analytics" },
  { href: "/admin/properties", label: "Propiedades", icon: Building2, module: "properties" },
  { href: "/admin/premium-properties", label: "Premium", icon: Crown, module: "premium_properties" },
  { href: "/admin/testimonials", label: "Testimonios", icon: MessageSquareQuote, module: "testimonials" },
  { href: "/admin/complaints", label: "Reclamaciones", icon: BookOpen, module: "complaints" },
  { href: "/admin/retornos", label: "Retornos", icon: ArrowDownToLine, module: "retornos" },
  { href: "/admin/chatbot-conversations", label: "Chatbot", icon: Bot, module: "chatbot" },
  { href: "/admin/users", label: "Usuarios", icon: Users, module: "users" },
  { href: "/admin/notifications", label: "Notificaciones", icon: Bell, module: "notifications" },
  { href: "/admin/access", label: "Accesos", icon: KeyRound, module: "access" },
  { href: "/admin/settings", label: "Configuración", icon: Settings, module: "settings" },
];

export function getPageTitle(pathname: string): string {
  const item = ADMIN_NAV_ITEMS.find((nav) =>
    nav.exact ? pathname === nav.href : pathname.startsWith(nav.href)
  );
  if (item) return item.label;
  if (pathname.startsWith("/admin/properties/")) return "Detalle de propiedad";
  if (pathname.startsWith("/admin/premium-properties/")) return "Detalle premium";
  if (pathname.startsWith("/admin/retornos")) return "Retornos";
  return "Admin";
}
