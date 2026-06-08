"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Menu,
  X,
  MessageSquareQuote,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminNotificationsPopover } from "@/components/admin/AdminNotificationsPopover";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/analytics", label: "Analítica", icon: BarChart3 },
  { href: "/admin/properties", label: "Propiedades", icon: Building2 },
  { href: "/admin/testimonials", label: "Testimonios", icon: MessageSquareQuote },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/analytics") return "Analítica";
  if (pathname.startsWith("/admin/properties/")) return "Detalle de propiedad";
  if (pathname === "/admin/properties") return "Propiedades";
  if (pathname === "/admin/testimonials") return "Testimonios";
  if (pathname === "/admin/users") return "Usuarios";
  if (pathname === "/admin/settings") return "Configuración";
  if (pathname === "/admin/notifications") return "Notificaciones";
  return "Admin";
}

export function AdminTopbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = getPageTitle(pathname);

  return (
    <>
      <div className="w-full">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <button
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="size-5 text-muted-foreground" />
              </button>
              <div className="size-7 rounded-lg bg-secondary flex items-center justify-center">
                <Shield className="size-3.5 text-secondary-foreground" />
              </div>
            </div>
            <h1 className="text-base font-semibold text-foreground hidden sm:block">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <AdminNotificationsPopover />
            <AdminUserMenu />
          </div>
        </header>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 bg-sidebar flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <Shield className="size-4 text-sidebar-primary-foreground" />
                </div>
                <span className="text-base font-bold tracking-tight text-sidebar-foreground">
                  remata admin
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <X className="size-5 text-sidebar-foreground/60" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
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
                    <item.icon className="size-4" />
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
