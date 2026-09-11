import {
  LayoutDashboard,
  Building2,
  Settings,
  History,
  Crown,
  ArrowDownToLine,
  Bell,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavGroup = "principal" | "cuenta" | "premium";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group: DashboardNavGroup;
  exact?: boolean;
}

export const NAV_GROUP_LABELS: Record<DashboardNavGroup, string> = {
  principal: "Principal",
  cuenta: "Cuenta",
  premium: "Premium",
};

/**
 * Fuente única de la navegación del dashboard (WP-2.1). Antes vivía
 * duplicada entre `Sidebar.tsx` y `Topbar.tsx`, que ya habían divergido
 * (Premium con o sin resaltado, orden distinto). "Invertir" no es una
 * intención de navegación propia — ver `/dashboard/invest` sigue existiendo
 * como destino del CTA "Explorar oportunidades" y de los enlaces "Invertir"
 * de cada propiedad (E-001).
 */
export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard, group: "principal", exact: true },
  { href: "/dashboard/properties", label: "Propiedades", icon: Building2, group: "principal" },
  { href: "/dashboard/my-investments", label: "Mis inversiones", icon: History, group: "principal" },
  { href: "/dashboard/retornos", label: "Retornos", icon: ArrowDownToLine, group: "principal" },
  { href: "/dashboard/notifications", label: "Notificaciones", icon: Bell, group: "cuenta" },
  { href: "/dashboard/account", label: "Mi cuenta", icon: Settings, group: "cuenta" },
  { href: "/dashboard/premium-properties", label: "Premium", icon: Crown, group: "premium" },
];

export function isNavItemActive(pathname: string, item: DashboardNavItem): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Inicio";
  if (pathname.startsWith("/dashboard/premium-properties/")) return "Detalle premium";
  if (pathname === "/dashboard/premium-properties") return "Premium";
  if (pathname.startsWith("/dashboard/properties/")) return "Detalle de propiedad";
  if (pathname === "/dashboard/properties") return "Propiedades";
  if (pathname === "/dashboard/my-investments") return "Mis inversiones";
  if (pathname === "/dashboard/retornos") return "Retornos";
  if (pathname === "/dashboard/invest") return "Nueva inversión";
  if (pathname === "/dashboard/premium-invest") return "Invertir Premium";
  if (pathname === "/dashboard/account") return "Mi cuenta";
  if (pathname === "/dashboard/notifications") return "Notificaciones";
  return "Inicio";
}
