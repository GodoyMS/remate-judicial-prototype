"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { NotificationsPopover } from "@/components/dashboard/NotificationsPopover";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { SidebarNav } from "@/components/dashboard/Sidebar";
import { useCurrentUser } from "@/contexts/user-context";
import { getPageTitle } from "@/lib/dashboard/nav-config";

export function Topbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useCurrentUser();

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
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
            <div className="px-3 py-4 border-t border-sidebar-border">
              <Link
                href="/login"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5 transition-colors"
              >
                <LogOut className="size-4 shrink-0" />
                Cerrar sesión
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
