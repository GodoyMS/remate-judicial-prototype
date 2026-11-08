"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { StatusPill } from "@/components/premium/StatusPill";
import { WindowClock } from "@/components/premium/WindowClock";
import { availabilityPill, trackingHref } from "@/components/premium/reservation-ui";
import type { Availability } from "@/lib/premium/availability";
import type { PremiumProperty } from "@/lib/premium/types";
import { formatCurrency } from "@/lib/currency";
import { formatLimaDate } from "@/lib/premium/dates";
import { cn } from "@/lib/utils";

interface PremiumPropertyCardProps {
  property: PremiumProperty;
  availability: Availability;
  isPremium: boolean;
  index?: number;
}

/**
 * Misma tarjeta que Estándar (imagen, título, etapa judicial, datos clave,
 * un CTA). Lo que cambia es el contenido: capital total en vez de ticket
 * mínimo, ventana en vez de cierre de subasta y "Ver expediente" en vez de
 * "Invertir". El dorado aparece una sola vez: el distintivo Premium.
 */
export function PremiumPropertyCard({ property: p, availability, isPremium, index = 0 }: PremiumPropertyCardProps) {
  const pill = availabilityPill(availability);
  const detailHref = `/dashboard/premium-properties/${p.id}`;
  const dimmed = availability.kind === "collective" || availability.kind === "held";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.05, duration: 0.35 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
      data-testid={`premium-card-${p.id}`}
    >
      <Link href={detailHref} className="block" aria-label={`Ver expediente de ${p.name}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.img}
            alt=""
            className={cn(
              "size-full object-cover transition-transform duration-500 group-hover:scale-105",
              dimmed && "saturate-[.6]"
            )}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" aria-hidden />
          <div className="absolute left-3 top-3 rounded-full bg-card/95 backdrop-blur-sm">
            <StatusPill tone={pill.tone} size="xs" className="ring-0">
              {pill.label}
            </StatusPill>
          </div>
          <PremiumBadge size="sm" className="absolute right-3 top-3" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <Link href={detailHref} className="block min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug text-foreground">{p.name}</h3>
            <CurrencyBadge currency={p.currency} className="mt-0.5 shrink-0" />
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">
              {p.district} · {p.type} · {p.area}
            </span>
          </p>
        </Link>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
          <div className="bg-muted px-3 py-3">
            <dt className="text-[11px] text-muted-foreground">Capital requerido (100%)</dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">
              {formatCurrency(p.totalValue, p.currency)}
            </dd>
          </div>
          <div className="bg-muted px-3 py-3">
            <dt className="text-[11px] text-muted-foreground">Retorno neto est.</dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">
              {isPremium ? (
                `${p.roiBasis.netRoi}%`
              ) : (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Lock className="size-3.5" /> Premium
                </span>
              )}
            </dd>
          </div>
        </dl>

        <div className="min-h-5 text-xs text-muted-foreground">
          {!isPremium ? (
            <span>Expediente, escenarios y reserva con acceso Premium.</span>
          ) : availability.kind === "available" ? (
            <WindowClock deadline={p.premiumDeadline} compact />
          ) : availability.kind === "held" ? (
            <span>Otro inversionista tiene una solicitud en revisión. Puede liberarse.</span>
          ) : availability.kind === "collective" ? (
            <span>Ventana finalizada · disponible en participación colectiva.</span>
          ) : availability.kind === "mine" ? (
            <span>
              Solicitud enviada el{" "}
              <span className="font-medium text-foreground">{formatLimaDate(availability.reservation.requestedAt)}</span>
            </span>
          ) : null}
        </div>

        <div className="mt-auto">
          {!isPremium ? (
            <Button asChild className="h-10 w-full rounded-xl font-semibold">
              <Link href="/dashboard/account?section=premium">Conocer Premium</Link>
            </Button>
          ) : availability.kind === "mine" ? (
            <Button asChild className="h-10 w-full rounded-xl font-semibold">
              <Link href={trackingHref(availability.reservation.id)}>
                Ver seguimiento
                <ArrowRight />
              </Link>
            </Button>
          ) : availability.kind === "collective" ? (
            <Button asChild variant="outline" className="h-10 w-full rounded-xl font-semibold">
              <Link href="/dashboard/properties">Ver en inversión colectiva</Link>
            </Button>
          ) : (
            <Button
              asChild
              variant={availability.kind === "available" ? "default" : "outline"}
              className="h-10 w-full rounded-xl font-semibold"
            >
              <Link href={detailHref}>Ver expediente</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
