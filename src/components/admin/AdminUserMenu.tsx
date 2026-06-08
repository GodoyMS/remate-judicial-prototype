"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  UserCheck,
  TrendingUp,
  ExternalLink,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAdminNotifications } from "@/contexts/admin-notifications-context";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { dashboardKpis } from "@/lib/admin/mock-data";
import { getInitials } from "@/lib/admin/rbac/constants";
import { cn } from "@/lib/utils";

export function AdminUserMenu() {
  const router = useRouter();
  const { unreadCount } = useAdminNotifications();
  const { account, role, isSuperAdmin, logout, canAccess } = useAdminAuth();

  const menuItems = [
    canAccess("dashboard") && {
      href: "/admin",
      label: "Dashboard",
      description: "KPIs y actividad reciente",
      icon: LayoutDashboard,
    },
    canAccess("properties") && {
      href: "/admin/properties",
      label: "Propiedades",
      description: `${dashboardKpis.activeProperties} activas`,
      icon: Building2,
    },
    canAccess("users") && {
      href: "/admin/users",
      label: "Usuarios",
      description: "Gestión y verificaciones",
      icon: Users,
    },
    canAccess("notifications") && {
      href: "/admin/notifications",
      label: "Notificaciones",
      description: "Centro de alertas",
      icon: Bell,
      showBadge: true,
    },
    canAccess("access") && {
      href: "/admin/access",
      label: "Gestión de accesos",
      description: "Roles y permisos",
      icon: KeyRound,
    },
    canAccess("settings") && {
      href: "/admin/settings",
      label: "Configuración",
      description: "Cuenta y preferencias",
      icon: Settings,
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    description: string;
    icon: typeof LayoutDashboard;
    showBadge?: boolean;
  }>;

  const handleHelp = () => {
    toast.message("Soporte interno", {
      description:
        "Canal #backoffice en Slack o escribe a ops@remata.pe para incidencias urgentes.",
    });
  };

  const handleLogout = () => {
    const name = account?.name?.split(" ")[0] ?? "Admin";
    logout();
    toast.success("Sesión cerrada", {
      description: `Hasta pronto, ${name}. El backoffice queda registrado.`,
    });
    router.push("/login-admin");
  };

  if (!account) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative size-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground cursor-pointer hover:opacity-90 transition-all ring-2 ring-transparent hover:ring-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
          aria-label="Menú de administrador"
        >
          {getInitials(account.name)}
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border-2 border-background" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 rounded-2xl p-0 overflow-hidden shadow-xl ring-1 ring-border/60"
      >
        <div className="bg-gradient-to-br from-secondary/15 via-background to-muted/40 px-4 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground shrink-0 shadow-md">
              {getInitials(account.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {account.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {account.email}
              </p>
              <Badge
                variant="outline"
                className="mt-1.5 h-5 text-[10px] font-medium border-secondary/30 bg-secondary/10 text-secondary-foreground"
              >
                <Shield className="size-2.5 mr-1" />
                {isSuperAdmin ? "Super Admin" : role?.name ?? "Admin"}
              </Badge>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-background/80 border border-border/60 px-3 py-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <UserCheck className="size-3" />
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  KYC pend.
                </span>
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5">2</p>
            </div>
            <div className="rounded-xl bg-background/80 border border-border/60 px-3 py-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="size-3" />
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  Invertido
                </span>
              </div>
              <p className="text-sm font-bold text-emerald-600 mt-0.5">
                S/ 2.8M
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuGroup className="p-1.5">
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild className="p-0">
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 cursor-pointer"
              >
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <item.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                {item.showBadge && unreadCount > 0 ? (
                  <span className="size-5 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shrink-0">
                    {unreadCount}
                  </span>
                ) : (
                  <ChevronRight className="size-3.5 text-muted-foreground/40 shrink-0" />
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-0" />

        <DropdownMenuGroup className="p-1.5">
          <DropdownMenuItem
            onClick={handleHelp}
            className="rounded-xl px-2.5 py-2.5 cursor-pointer"
          >
            <HelpCircle className="size-4 text-muted-foreground" />
            <span className="flex-1">Soporte interno</span>
            <ExternalLink className="size-3 text-muted-foreground/50" />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-0" />

        <div className="p-1.5">
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
            className={cn(
              "rounded-xl px-2.5 py-2.5 cursor-pointer",
              "text-red-600 focus:text-red-600 focus:bg-red-50"
            )}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
