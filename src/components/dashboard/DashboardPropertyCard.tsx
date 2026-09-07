"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import type { PropertyCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

export type DashboardPropertyCardData = {
  id: number;
  name: string;
  district: string;
  type: string;
  area: string;
  price: string;
  minInvestment: string;
  currency: PropertyCurrency;
  roi: string;
  deadline: string;
  status: string;
  img: string;
};

interface DashboardPropertyCardProps {
  property: DashboardPropertyCardData;
  index?: number;
  className?: string;
}

export function DashboardPropertyCard({
  property: p,
  index = 0,
  className,
}: DashboardPropertyCardProps) {
  const isActive = p.status === "Activo";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg",
        className
      )}
    >
      <Link
        href={`/dashboard/properties/${p.id}`}
        className="block"
        aria-label={`Ver ${p.name}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.img}
            alt={p.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent"
            aria-hidden
          />
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm",
              isActive
                ? "bg-card/90 text-foreground"
                : "bg-foreground/80 text-background"
            )}
          >
            {p.status}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <Link href={`/dashboard/properties/${p.id}`} className="block min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug text-foreground">
              {p.name}
            </h3>
            <CurrencyBadge currency={p.currency} className="mt-0.5 shrink-0" />
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">
              {p.district} · {p.type} · {p.area}
            </span>
          </p>
        </Link>

        <dl>
          <dd className=" bg-muted rounded-md p-2 text-xs text-muted-foreground">
          Expediente en esta etapa avanzada y sin cargas registrales observadas en el estudio de titulos
          </dd>
        </dl>

        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
          <div className="bg-muted px-2 py-3 text-center sm:px-3">
            <dt className="text-[11px] text-muted-foreground">Precio base</dt>
            <dd className="mt-1 text-xs font-bold tabular-nums text-foreground sm:text-sm">
              {p.price}
            </dd>
          </div>
          <div className="bg-muted px-2 py-3 text-center sm:px-3">
            <dt className="text-[11px] text-muted-foreground">ROI est.</dt>
            <dd className="mt-1 text-xs font-bold tabular-nums text-success sm:text-sm">
              {p.roi}
            </dd>
          </div>
          <div className="bg-muted px-2 py-3 text-center sm:px-3">
            <dt className="text-[11px] text-muted-foreground">Cierra</dt>
            <dd className="mt-1 text-xs font-bold tabular-nums text-foreground sm:text-sm">
              {p.deadline}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground sm:shrink-0">
            Desde <span className="font-semibold text-foreground">{p.minInvestment}</span>
          </p>
          <Button
            asChild
            size="sm"
            className="h-10 w-full rounded-xl font-semibold sm:flex-1"
          >
            <Link href={`/dashboard/invest?property=${p.id}`}>Invertir</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
