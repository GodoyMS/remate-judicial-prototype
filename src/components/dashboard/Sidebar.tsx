"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { useCurrentUser } from "@/contexts/user-context";
import {
  DASHBOARD_NAV_ITEMS,
  NAV_GROUP_LABELS,
  isNavItemActive,
  type DashboardNavGroup,
} from "@/lib/dashboard/nav-config";

const GROUP_ORDER: DashboardNavGroup[] = ["principal", "cuenta", "premium"];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isPremium, logout } = useCurrentUser();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border min-h-screen shrink-0">
      <div className="flex items-center px-6 h-16 border-b border-sidebar-border shrink-0">
        <Logo className="text-xl text-sidebar-primary" />
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {GROUP_ORDER.map((group) => {
          const items = DASHBOARD_NAV_ITEMS.filter((item) => item.group === group);
          return (
            <div key={group} className={group !== "principal" ? "mt-4" : undefined}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-2">
                {NAV_GROUP_LABELS[group]}
              </p>
              {items.map((item) => {
                const active = isNavItemActive(pathname, item);
                const isPremiumItem = group === "premium";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                      active
                        ? isPremiumItem
                          ? "bg-premium/15 text-premium"
                          : "bg-sidebar-primary/12 text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    {active && (
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full",
                          isPremiumItem ? "bg-premium" : "bg-sidebar-primary"
                        )}
                      />
                    )}
                    <item.icon className="size-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isPremiumItem && isPremium && !active && (
                      <span className="size-1.5 rounded-full bg-premium animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border flex flex-col gap-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent">
          <div className="size-8 rounded-full bg-sidebar-primary flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground shrink-0">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">{user.name}</p>
              {isPremium && <PremiumBadge size="sm" className="scale-90 origin-left" />}
            </div>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">
              {isPremium ? "Acceso Premium" : "Cuenta Estándar"}
            </p>
          </div>
        </div>
        <Link
          href="/login"
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
        >
          <LogOut className="size-4 shrink-0" />
          <span>Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  );
}
