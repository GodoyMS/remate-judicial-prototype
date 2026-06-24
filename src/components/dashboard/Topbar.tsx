"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gavel,
  LayoutDashboard,
  Building2,
  TrendingUp,
  Settings,
  Menu,
  X,
  History,
  Crown,
  ArrowDownToLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationsPopover } from "@/components/dashboard/NotificationsPopover";
import { UserMenu } from "@/components/dashboard/UserMenu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/properties", label: "Propiedades", icon: Building2 },
  { href: "/dashboard/premium-properties", label: "Premium", icon: Crown },
  { href: "/dashboard/my-investments", label: "Mis inversiones", icon: History },
  { href: "/dashboard/retornos", label: "Retornos", icon: ArrowDownToLine },
  { href: "/dashboard/invest", label: "Invertir", icon: TrendingUp },
  { href: "/dashboard/account", label: "Mi cuenta", icon: Settings },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/dashboard/premium-properties/")) return "Detalle premium";
  if (pathname === "/dashboard/premium-properties") return "Premium";
  if (pathname.startsWith("/dashboard/properties/")) return "Detalle de propiedad";
  if (pathname === "/dashboard/properties") return "Propiedades";
  if (pathname === "/dashboard/my-investments") return "Mis inversiones";
  if (pathname === "/dashboard/retornos") return "Retornos";
  if (pathname === "/dashboard/invest") return "Invertir";
  if (pathname === "/dashboard/premium-invest") return "Invertir Premium";
  if (pathname === "/dashboard/account") return "Mi cuenta";
  if (pathname === "/dashboard/notifications") return "Notificaciones";
  return "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = getPageTitle(pathname);

  return (
    <>
      <div className="w-full">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="lg:hidden flex items-center gap-2 shrink-0">
              <button
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu className="size-5 text-muted-foreground" />
              </button>
              <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
                <Gavel className="size-3.5 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <NotificationsPopover />
            <UserMenu />
          </div>
        </header>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[min(18rem,85vw)] bg-sidebar flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
                  <Gavel className="size-4 text-sidebar-primary-foreground" />
                </div>
                <span className="text-base font-bold tracking-tight text-sidebar-foreground truncate">
                  remata
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors shrink-0"
                aria-label="Cerrar menú"
              >
                <X className="size-5 text-sidebar-foreground/60" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
              {navItems.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
