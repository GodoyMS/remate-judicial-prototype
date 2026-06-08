"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { ADMIN_NAV_ITEMS } from "@/lib/admin/nav-config";
import { getInitials } from "@/lib/admin/rbac/constants";

export function AdminSidebar() {
  const pathname = usePathname();
  const { account, role, isSuperAdmin, canAccess, logout } = useAdminAuth();

  const visibleNav = ADMIN_NAV_ITEMS.filter((item) => canAccess(item.module));

  const handleLogout = () => {
    logout();
    window.location.href = "/login-admin";
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border min-h-screen shrink-0">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-sidebar-border shrink-0">
        <div className="size-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Shield className="size-4 text-sidebar-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">remata</span>
          <span className="text-[10px] text-sidebar-foreground/50 -mt-0.5">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-2">
          Backoffice
        </p>
        {visibleNav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="size-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border flex flex-col gap-2">
        {account && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent">
            <div className="size-8 rounded-full bg-sidebar-primary flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground shrink-0">
              {getInitials(account.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">
                {account.name}
              </p>
              <Badge
                variant="secondary"
                className="text-[9px] h-4 px-1.5 mt-0.5 bg-sidebar-primary/20 text-sidebar-primary border-0"
              >
                {isSuperAdmin ? "Super Admin" : role?.name ?? "Admin"}
              </Badge>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all w-full text-left"
        >
          <LogOut className="size-4 shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
