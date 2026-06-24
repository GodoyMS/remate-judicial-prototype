"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Settings,
  Gavel,
  LogOut,
  ChevronRight,
  History,
  Crown,
  ArrowDownToLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { useCurrentUser } from "@/contexts/user-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/properties", label: "Propiedades", icon: Building2 },
  { href: "/dashboard/premium-properties", label: "Premium", icon: Crown, premiumHighlight: true },
  { href: "/dashboard/my-investments", label: "Mis inversiones", icon: History },
  { href: "/dashboard/retornos", label: "Retornos", icon: ArrowDownToLine },
  { href: "/dashboard/invest", label: "Invertir", icon: TrendingUp },
  { href: "/dashboard/account", label: "Mi cuenta", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isPremium, logout } = useCurrentUser();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border min-h-screen shrink-0">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-sidebar-border shrink-0">
        <div className="size-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Gavel className="size-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-base font-bold tracking-tight text-sidebar-foreground">remata</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-2">
          Menú principal
        </p>
        {navItems.map((item) => {
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
                  ? item.premiumHighlight && isPremium
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                    : "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                item.premiumHighlight && !active && !isPremium && "opacity-80"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.premiumHighlight && isPremium && !active && (
                <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
              {active && <ChevronRight className="size-3.5 opacity-60" />}
            </Link>
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
              {isPremium ? "Plan Premium ✓" : "Plan Estándar"}
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
