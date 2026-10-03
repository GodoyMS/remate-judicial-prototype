"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
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
  const { user, isPremium, logout } = useCurrentUser();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border min-h-screen shrink-0">
      <div className="flex items-center px-6 h-16 border-b border-sidebar-border shrink-0">
        <Logo className="text-xl text-sidebar-primary" />
      </div>

      <SidebarNav />

      <div className="px-3 py-4 border-t border-sidebar-border flex flex-col gap-1">
        {/* Cuenta del usuario en color primario: es el ancla visual del
            sidebar, así que el contraste se invierte (texto sobre primary). */}
        <Link
          href="/dashboard/account"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-sidebar-primary/20 hover:bg-sidebar-primary/90 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
        >
          <div className="size-8 rounded-full bg-sidebar-primary-foreground/15 ring-1 ring-sidebar-primary-foreground/25 flex items-center justify-center text-xs font-bold shrink-0">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold truncate">{user.name}</p>
              {isPremium && <PremiumBadge size="sm" className="scale-90 origin-left" />}
            </div>
            <p className="text-[10px] text-sidebar-primary-foreground/75 truncate">
              {isPremium ? "Acceso Premium" : "Cuenta Estándar"}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-sidebar-primary-foreground/70" />
        </Link>
        <Link
          href="/login"
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5 transition-all"
        >
          <LogOut className="size-4 shrink-0" />
          <span>Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  );
}

/**
 * Navegación del dashboard, compartida entre el sidebar de escritorio y el
 * drawer móvil del Topbar para que ambos tengan el mismo estilo.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isPremium } = useCurrentUser();

  return (
    <nav className="flex-1 flex flex-col px-3 py-5 overflow-y-auto">
      {GROUP_ORDER.map((group) => {
        const items = DASHBOARD_NAV_ITEMS.filter((item) => item.group === group);
        return (
          <div key={group} className={cn("flex flex-col gap-0.5", group !== "principal" && "mt-6")}>
            <p className="dash-overline text-sidebar-foreground/45 px-3 mb-2">
              {NAV_GROUP_LABELS[group]}
            </p>
            {items.map((item) => {
              const active = isNavItemActive(pathname, item);
              const isPremiumItem = group === "premium";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 h-11 px-3 rounded-xl text-[15px] font-medium transition-colors duration-150",
                    "outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/40",
                    active
                      ? isPremiumItem
                        ? "bg-premium/15 text-premium"
                        : "bg-sidebar-primary/12 text-sidebar-primary dark:bg-sidebar-accent dark:text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5"
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full",
                        isPremiumItem ? "bg-premium" : "bg-sidebar-primary"
                      )}
                    />
                  )}
                  <item.icon className="size-[18px] shrink-0" strokeWidth={1.75} />
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
  );
}
