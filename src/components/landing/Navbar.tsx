"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Propiedades", href: "#propiedades" },
  { label: "Nosotros", href: "#nosotros" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50  backdrop-blur-md ">
      <div className="mx-auto max-w-7xl section-padding">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Gavel className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              remata
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((l) => (
              <Button
                variant="ghost"
                className="font-medium hover:bg-accent! text-base"
                size="sm"
                key={l.href}

                asChild
              >
                <a
                  href={l.href}
                  className="  hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              </Button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="font-semibold text-base" size="lg" asChild>
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
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
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
