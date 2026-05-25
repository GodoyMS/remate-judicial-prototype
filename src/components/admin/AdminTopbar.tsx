"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Shield,
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Menu,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Propiedades", icon: Building2 },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/properties/")) return "Detalle de propiedad";
  if (pathname === "/admin/properties") return "Propiedades";
  if (pathname === "/admin/users") return "Usuarios";
  if (pathname === "/admin/settings") return "Configuración";
  return "Admin";
}

export function AdminTopbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = getPageTitle(pathname);

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-sm">
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
          <h1 className="text-base font-semibold text-foreground hidden sm:block">{title}</h1>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar propiedades, usuarios..."
              className="pl-9 h-9 rounded-xl border-border/80 bg-muted/30 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative rounded-xl">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
          </Button>
          <div className="size-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground cursor-pointer hover:opacity-90 transition-opacity">
            VR
          </div>
        </div>
      </header>

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
                <span className="text-base font-bold tracking-tight text-sidebar-foreground">remata admin</span>
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
