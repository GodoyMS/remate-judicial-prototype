"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Audit finding RM-033: "Nosotros" pointed at `#nosotros`, an anchor that did
 * not exist on the page, so the item silently did nothing. Every entry now has
 * a real destination, and the in-page anchors are absolute (`/#…`) so they
 * still work from the legal pages, which share this navbar.
 */
/**
 * Second review, finding 4: "Propiedades" in the main menu did not open a
 * catalogue — it scrolled to a three-card teaser whose only action was
 * account creation. It now points at the public catalogue.
 */
const links = [
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Propiedades", href: "/propiedades" },
  { label: "Tarifas", href: "/tarifas" },
  { label: "Nosotros", href: "/nosotros" },
];

/** Which page surface sits under the fixed navbar band. */
function getToneUnderNav(): "dark" | "light" {
  const probeY = 32; // mid navbar
  const sections = document.querySelectorAll<HTMLElement>("[data-nav-tone]");
  let tone: "dark" | "light" = "light";
  for (const el of sections) {
    const rect = el.getBoundingClientRect();
    if (rect.top <= probeY && rect.bottom > probeY) {
      // Last match wins when sections overlap during scroll.
      tone = el.dataset.navTone === "dark" ? "dark" : "light";
    }
  }
  return tone;
}

function initialNavTone(pathname: string): "dark" | "light" {
  // Nosotros opens on a dark full-bleed hero; landing opens on a light hero.
  return pathname === "/nosotros" ? "dark" : "light";
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(
    () => initialNavTone(pathname) === "dark",
  );
  const [scrolled, setScrolled] = useState(false);

  const isOverlayPage = pathname === "/" || pathname === "/nosotros";
  // Solid bar when the mobile sheet is open, or on pages without an overlay hero
  const solid = open || !isOverlayPage;
  /**
   * RM-010 — the bar used to stay fully transparent over every light section,
   * so section headings scrolled straight through the nav labels and both
   * became hard to read. Past the hero it now carries a translucent surface,
   * which keeps the glass look while giving the labels a ground to sit on.
   */
  const scrim = !solid && scrolled;
  const lightText = !solid && overDark;

  useEffect(() => {
    if (!isOverlayPage) return;

    const update = () => {
      setOverDark(getToneUnderNav() === "dark");
      setScrolled(window.scrollY > 24);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isOverlayPage, pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,color] duration-300",
        solid
          ? "border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-md"
          : scrim
            ? overDark
              ? "border-b border-white/10 bg-black/35 backdrop-blur-md"
              : "border-b border-border/40 bg-background/80 shadow-sm backdrop-blur-md"
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
                <Link href={l.href}>{l.label}</Link>
              </Button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* RM-012 — "Iniciar sesión" was a transparent ghost button in small,
                low-contrast type. It now carries a visible outlined container at
                the same height as the primary CTA, so it reads as an action
                without competing with it for emphasis. */}
            <Button
              variant="outline"
              size="lg"
              asChild
              className={cn(
                "rounded-full border px-5 text-base font-semibold transition-colors",
                lightText
                  ? "border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  : "border-foreground/25 bg-background/70 text-foreground hover:bg-muted",
              )}
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            {/* RM-014 — one label for the primary action, used identically in
                the navbar, the hero, "Cómo funciona" and the closing CTA. */}
            <Button
              size="lg"
              asChild
              className="rounded-full text-base font-semibold px-5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/register">Crear cuenta gratis</Link>
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
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="section-padding py-4 flex flex-col gap-4">
          {[...links, { label: "Contacto", href: "/contacto" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
            <Button variant="outline" size="lg" asChild className="rounded-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                Iniciar sesión
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="rounded-full bg-primary text-primary-foreground"
            >
              <Link href="/register" onClick={() => setOpen(false)}>
                Crear cuenta gratis
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
