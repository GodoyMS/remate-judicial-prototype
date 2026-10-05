"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  icon?: LucideIcon;
  /** Chip junto al eyebrow (p. ej. "3 sin leer"). */
  badge?: ReactNode;
  /** Acciones a la derecha (botones). */
  actions?: ReactNode;
  /** Debe coincidir con HERO_ROUTES del Topbar para continuar su banda. */
  tone?: "primary" | "inverse";
  className?: string;
}

const TONES = {
  primary: {
    root: "bg-primary text-primary-foreground",
    muted: "text-primary-foreground/75",
    icon: "bg-primary-foreground/12 ring-primary-foreground/20 text-primary-foreground",
    divider: "bg-primary-foreground/15",
  },
  inverse: {
    root: "bg-foreground text-background",
    muted: "text-background/70",
    icon: "bg-background/10 ring-background/15 text-background",
    divider: "bg-background/15",
  },
};

/**
 * Hero a sangre común a las páginas del dashboard: continúa la banda del
 * Topbar (ver HERO_ROUTES) anulando el padding de <main>.
 */
export function PageHero({
  title,
  eyebrow,
  description,
  icon: Icon,
  badge,
  actions,
  tone = "primary",
  className,
}: PageHeroProps) {
  const t = TONES[tone];
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-8 rounded-b-[2rem] px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-8 sm:pb-12",
        t.root,
        className
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
          {Icon && (
            <span
              className={cn(
                "hidden sm:flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1",
                t.icon
              )}
            >
              <Icon className="size-6" />
            </span>
          )}
          <div className="min-w-0">
            {(eyebrow || badge) && (
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {eyebrow && (
                  <p className={cn("text-xs font-semibold uppercase tracking-[0.14em]", t.muted)}>
                    {eyebrow}
                  </p>
                )}
                {badge}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight text-balance">
              {title}
            </h1>
            {description && (
              <p className={cn("mt-3 max-w-2xl text-sm sm:text-base leading-relaxed", t.muted)}>
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </motion.header>
  );
}
