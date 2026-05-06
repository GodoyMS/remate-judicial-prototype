"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Gavel,
  LayoutDashboard,
  Building2,
  TrendingUp,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "Propiedades", icon: Building2 },
  { href: "/dashboard/invest", label: "Invertir", icon: TrendingUp },
  { href: "/dashboard/account", label: "Mi cuenta", icon: Settings },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/properties": "Propiedades",
  "/dashboard/invest": "Invertir",
  "/dashboard/account": "Mi cuenta",
};

export function Topbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <>
      <div className="w-full ">
      <header className="h-16  flex items-center justify-between px-4 sm:px-6 shrink-0">
        {/* Left: mobile menu + page title */}
        <div className="flex items-center gap-3">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5 text-muted-foreground" />
            </button>
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <Gavel className="size-3.5 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-base font-semibold text-foreground hidden sm:block">{title}</h1>
        </div>

        {/* Right: notifications + avatar */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative rounded-xl">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
          </Button>
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity">
            AS
          </div>
        </div>
      </header>
      </div>

      {/* Mobile nav drawer */}
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
                  <Gavel className="size-4 text-sidebar-primary-foreground" />
                </div>
                <span className="text-base font-bold tracking-tight text-sidebar-foreground">remata</span>
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
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
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
