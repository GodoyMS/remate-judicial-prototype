"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  TrendingUp,
  Clock,
  ArrowRight,
  Home,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { dashboardProperties, formatCurrency } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

const properties = dashboardProperties.slice(0, 3).map((p) => ({
  id: p.id,
  title: p.name,
  address: p.address,
  type: p.type,
  area: p.area,
  basePrice: formatCurrency(p.price, p.currency),
  currency: p.currency,
  roi: `${p.roi}%`,
  deadline: p.deadline,
  status: p.status,
  img: p.img,
  badge: p.badge.replace(/^[^\s]+\s/, ""),
  featured: p.id === 1,
}));

export function PropertyPreview() {
  return (
    <section
      id="propiedades"
      className="relative overflow-hidden bg-muted/40 py-24 text-foreground"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--primary) 10%, transparent) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl section-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex max-w-xl flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Building2 className="size-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Propiedades disponibles
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Subastas abiertas{" "}
              <span className="text-primary">ahora</span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Propiedades auditadas legalmente, listas para invertir en soles o dólares.
              Actualizado en tiempo real.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="h-11 shrink-0 rounded-full border-primary/40 bg-transparent px-6 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/register">
              Ver todas las propiedades
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                "group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                p.featured
                  ? "border-primary/40 ring-1 ring-primary/20"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-primary/40 bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {p.status}
                  </span>
                  {p.featured && (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                      Destacado
                    </span>
                  )}
                </div>
                <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {p.badge}
                </span>
                <div className="absolute right-3 bottom-3 rounded-xl bg-primary px-3 py-1.5">
                  <p className="text-[10px] font-medium text-primary-foreground/70">
                    ROI est.
                  </p>
                  <p className="flex items-center gap-0.5 text-lg font-bold text-primary-foreground">
                    <TrendingUp className="size-4" />
                    {p.roi}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-5">
                <div>
                  <div className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Home className="size-3.5" />
                    <span>
                      {p.type} · {p.area}
                    </span>
                    <CurrencyBadge
                      currency={p.currency}
                      className="ml-auto"
                    />
                  </div>
                  <h3 className="text-base font-semibold leading-snug text-foreground">
                    {p.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{p.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
                  <div className="bg-muted px-3 py-3">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Precio base
                    </span>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      {p.basePrice}
                    </p>
                  </div>
                  <div className="bg-muted px-3 py-3">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Cierra en
                    </span>
                    <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-primary">
                      <Clock className="size-3.5" />
                      {p.deadline}
                    </p>
                  </div>
                </div>

                <Button
                  className="h-10 w-full rounded-xl bg-primary font-medium text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <Link href="/register">Invertir ahora</Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
