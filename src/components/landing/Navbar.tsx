"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Propiedades", href: "#propiedades" },
  { label: "Nosotros", href: "#nosotros" },
];

/** Which page surface sits under the fixed navbar band. */
function getToneUnderNav(): "dark" | "light" {
  const probeY = 32; // mid navbar
  const sections = document.querySelectorAll<HTMLElement>("[data-nav-tone]");
  for (const el of sections) {
    const rect = el.getBoundingClientRect();
    if (rect.top <= probeY && rect.bottom > probeY) {
      return el.dataset.navTone === "dark" ? "dark" : "light";
    }
  }
  return "light";
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);

  const isLanding = pathname === "/";
  // Solid bar when the mobile sheet is open, or on non-landing pages
  const solid = open || !isLanding;
  // Light text only when the glass bar sits over a dark surface
  const lightText = !solid && overDark;

  useEffect(() => {
    if (!isLanding) {
      setOverDark(false);
      return;
    }

    const update = () => setOverDark(getToneUnderNav() === "dark");
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isLanding]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,color] duration-300",
        solid
          ? "border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent backdrop-blur-md",
      )}
    >
      <div className="mx-auto max-w-[1400px] section-padding">
        <div className="flex h-16 items-center justify-between">
          {/* Logo — always brand primary */}
          <Link href="/" className="flex items-center group">
            <Logo className="text-2xl text-primary" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((l) => (
              <Button
                variant="ghost"
                className={cn(
                  "font-medium text-base transition-colors",
                  lightText
                    ? "text-white/90 hover:bg-white/10 hover:text-white"
                    : "text-foreground hover:bg-accent!",
                )}
                size="sm"
                key={l.href}
                asChild
              >
                <a href={l.href}>{l.label}</a>
              </Button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className={cn(
                "font-semibold text-base transition-colors",
                lightText
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-foreground",
              )}
              size="lg"
              asChild
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="rounded-full text-base font-semibold px-5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/register">Crear cuenta</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              lightText
                ? "text-white hover:bg-white/10"
                : "text-foreground hover:bg-muted",
            )}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t border-border/60 bg-background overflow-hidden transition-all duration-300",
          open ? "max-h-64" : "max-h-0",
        )}
      >
        <div className="section-padding py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="rounded-full bg-primary text-primary-foreground"
            >
              <Link href="/register">Crear cuenta gratis</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
