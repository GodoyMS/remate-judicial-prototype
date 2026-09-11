"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { NotificationsPopover } from "@/components/dashboard/NotificationsPopover";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { useCurrentUser } from "@/contexts/user-context";
import {
  DASHBOARD_NAV_ITEMS,
  NAV_GROUP_LABELS,
  getPageTitle,
  isNavItemActive,
  type DashboardNavGroup,
} from "@/lib/dashboard/nav-config";

const GROUP_ORDER: DashboardNavGroup[] = ["principal", "cuenta", "premium"];

export function Topbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isPremium, logout } = useCurrentUser();

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
              <span
                className="inline-flex text-primary"
                style={{ fontSize: "calc(1.75rem * var(--logo-scale, 1))" }}
              >
                <LogoMark className="size-[1em]" />
              </span>
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
              <div className="flex items-center min-w-0">
                <Logo className="text-xl text-sidebar-primary" />
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
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                            active
                              ? isPremiumItem
                                ? "bg-premium/15 text-premium"
                                : "bg-sidebar-primary/12 text-sidebar-primary"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
                          {item.label}
                          {isPremiumItem && isPremium && !active && (
                            <span className="size-1.5 rounded-full bg-premium animate-pulse ml-auto" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
              <Link
                href="/login"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 mt-4 rounded-xl text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
              >
                <LogOut className="size-4 shrink-0" />
                Cerrar sesión
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
