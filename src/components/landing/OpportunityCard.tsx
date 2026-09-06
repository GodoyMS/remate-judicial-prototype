"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { formatMoney, formatPercent } from "@/lib/currency";
import type { LandingOpportunity } from "@/lib/landing/opportunities";
import { cn } from "@/lib/utils";

/**
 * The summary card, shared by the landing and the public catalogue so the two
 * can never drift (second review, finding 14).
 *
 * Six layers, in this order and no more: image · status · name and location ·
 * three comparable metrics · closing date · one CTA. The rationale paragraph,
 * the worked example and the risk note that used to live inside the card are
 * on the property page, where a reader has decided to go deeper.
 */
export function OpportunityCard({
  opportunity: o,
  index = 0,
  animate = true,
}: {
  opportunity: LandingOpportunity;
  index?: number;
  animate?: boolean;
}) {
  const isOpen = o.availability === "open";

  return (
    <motion.article
      initial={animate ? { opacity: 0, y: 24 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
    >
      {/* 1 · image  ·  2 · status */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={o.image}
          alt={o.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent" />
        <span
          className={cn(
            "type-label absolute left-3 top-3 rounded-full px-2.5 py-1 backdrop-blur-sm",
            isOpen
              ? "bg-card/90 text-foreground"
              : "bg-foreground/80 text-background"
          )}
        >
          {o.statusLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* 3 · name and location */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="type-h3 text-balance text-foreground">{o.name}</h3>
            <CurrencyBadge currency={o.currency} className="mt-0.5 shrink-0" />
          </div>
          <p className="mt-1 flex items-center gap-1 type-caption text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">
              {o.district} · {o.type} · {o.area}
            </span>
          </p>
        </div>

        {/* 4 · the three metrics that make cards comparable */}
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
          <div className="bg-muted px-3 py-3">
            <dt className="type-caption text-muted-foreground">Precio base</dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">
              {formatMoney(o.basePrice, o.currency)}
            </dd>
          </div>
          <div className="bg-muted px-3 py-3">
            <dt className="type-caption text-muted-foreground">Retorno est.</dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-primary">
              {formatPercent(o.roi)} anual
            </dd>
          </div>
          <div className="bg-muted px-3 py-3">
            <dt className="type-caption text-muted-foreground">
              Inversión mín.
            </dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">
              {formatMoney(o.minTicket, o.currency)}
            </dd>
          </div>
        </dl>

        {/* 5 · how long it stays open */}
        <p className="flex items-center gap-1.5 type-caption text-muted-foreground">
          <CalendarClock className="size-3.5 shrink-0 text-primary" />
          {isOpen ? (
            <>
              Cierra en {o.deadline} · {formatPercent(o.fundedPct)} del capital
              cubierto
            </>
          ) : (
            <>Abre en {o.deadline} · aún no acepta aportes</>
          )}
        </p>

        {/* 6 · one CTA, to this opportunity */}
        <Button
          className="mt-auto h-10 w-full rounded-xl font-semibold"
          variant="outline"
          asChild
        >
          <Link href={`/propiedades/${o.slug}`}>
            Ver oportunidad
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}
