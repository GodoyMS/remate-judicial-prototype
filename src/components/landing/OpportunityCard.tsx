"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney, formatPercent } from "@/lib/currency";
import type { LandingOpportunity } from "@/lib/landing/opportunities";
import { cn } from "@/lib/utils";

/**
 * Summary card for the landing and public catalogue (second review, finding 14).
 *
 * Layout matches the "Subastas abiertas ahora" reference: image with a closing
 * badge, status tag, title, address, three comparable metrics, one CTA.
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
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={o.image}
          alt={o.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Cierra en {o.deadline}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <span
          className={cn(
            "type-label w-fit rounded-full px-2.5 py-1",
            isOpen
              ? "bg-success/15 text-success"
              : "bg-primary/15 text-primary"
          )}
        >
          {isOpen ? "Disponible" : "Próximo"}
        </span>

        <div>
          <h3 className="type-h3 text-balance text-foreground">{o.name}</h3>
          <p className="mt-1.5 flex items-start gap-1.5 type-caption text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span className="text-pretty">{o.address}</span>
          </p>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-border border-y border-border py-3">
          <div className="min-w-0 px-2 text-center first:pl-0 last:pr-0 sm:px-3">
            <dt className="type-caption text-muted-foreground">Precio base</dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">
              {formatMoney(o.basePrice, o.currency)}
            </dd>
          </div>
          <div className="min-w-0 px-2 text-center sm:px-3">
            <dt className="type-caption text-muted-foreground">
              Retorno estimado
            </dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">
              {formatPercent(o.roi)} anual
            </dd>
          </div>
          <div className="min-w-0 px-2 text-center last:pr-0 sm:px-3">
            <dt className="type-caption text-muted-foreground">
              Inversión mínima
            </dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">
              {formatMoney(o.minTicket, o.currency)}
            </dd>
          </div>
        </dl>

        <Button
          className="mt-auto h-11 w-full rounded-xl border-primary font-semibold text-primary hover:bg-primary/5"
          variant="outline"
          asChild
        >
          <Link href={`/propiedades/${o.slug}`}>Ver oportunidad</Link>
        </Button>
      </div>
    </motion.article>
  );
}
