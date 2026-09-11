"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  FEES,
  SCENARIOS,
  openOpportunities,
  simulate,
} from "@/lib/landing/opportunities";
import {
  formatMoney,
  formatPercent,
  type PropertyCurrency,
} from "@/lib/currency";
import { cn } from "@/lib/utils";

const OPPORTUNITIES = openOpportunities().map((o) => ({
  id: o.id,
  slug: o.slug,
  name: o.name,
  district: o.district,
  currency: o.currency,
  roi: o.roi,
  min: o.minTicket,
}));

const RANGE: Record<
  PropertyCurrency,
  { min: number; max: number; step: number }
> = {
  PEN: { min: 500, max: 50_000, step: 500 },
  USD: { min: 500, max: 15_000, step: 250 },
};

const toneStyles = {
  adverse: {
    card: "border-destructive/40 bg-destructive/10 shadow-sm shadow-destructive/10",
    label: "text-destructive",
    value: "text-destructive",
    bar: "bg-destructive",
    step: "bg-destructive text-white",
    rail: "bg-destructive/25",
  },
  base: {
    card: "border-primary bg-primary/10 ring-2 ring-primary/25 shadow-md shadow-primary/15",
    label: "text-primary",
    value: "text-foreground",
    bar: "bg-primary",
    step: "bg-primary text-primary-foreground",
    rail: "bg-primary/30",
  },
  favourable: {
    card: "border-success/40 bg-success/10 shadow-sm shadow-success/10",
    label: "text-success",
    value: "text-foreground",
    bar: "bg-success",
    step: "bg-success text-white",
    rail: "bg-success/25",
  },
} as const;

const FLOW_STEPS = [
  { n: "01", title: "Elige", hint: "La operación" },
  { n: "02", title: "Define", hint: "Tu monto" },
  { n: "03", title: "Descubre", hint: "Los tres caminos" },
] as const;

export function ReturnSimulator() {
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState(OPPORTUNITIES[0]!.id);
  const opportunity =
    OPPORTUNITIES.find((o) => o.id === selectedId) ?? OPPORTUNITIES[0]!;
  const range = RANGE[opportunity.currency];

  const [amountByCurrency, setAmountByCurrency] = useState<
    Record<PropertyCurrency, number>
  >({ PEN: 5_000, USD: 3_000 });

  const amount = Math.min(
    range.max,
    Math.max(opportunity.min, amountByCurrency[opportunity.currency]),
  );

  const results = useMemo(
    () => SCENARIOS.map((s) => simulate(amount, opportunity.roi, s)),
    [amount, opportunity.roi],
  );
  const expected = results[1]!;
  const scale = Math.max(...results.map((r) => Math.abs(r.netGain)), 1);
  const money = (value: number) => formatMoney(value, opportunity.currency);

  const feeRows = [
    {
      concept: "Estructuración",
      rate: `${formatPercent(FEES.structuring * 100, 1)} del monto invertido`,
      value: money(Math.round(expected.structuringFee)),
      helper: "Se cobra al cerrarse el capital, antes de la subasta.",
    },
    {
      concept: "Gestión del activo",
      rate: `${formatPercent(FEES.management * 100, 1)} anual sobre el capital`,
      value: money(Math.round(expected.managementFee)),
      helper: `Prorrateado a ${expected.scenario.months} meses en este escenario.`,
    },
    {
      concept: "Comisión de éxito",
      rate: `${formatPercent(FEES.success * 100)} de la ganancia`,
      value: money(Math.round(expected.successFee)),
      helper: "No se cobra si no existe ganancia.",
    },
  ];

  return (
    <section
      id="simulador"
      data-nav-tone="light"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24 scroll-mt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-10 size-64 rounded-full bg-success/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="type-label inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-primary">
            <Calculator className="size-3.5" />
            Simulador
          </span>
          <h2 className="type-h2 mt-5 text-balance text-foreground">
            ¿Qué pasaría con <span className="text-primary">tu dinero</span>?
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            Tres pasos. Primero eliges la operación, luego el monto, y al final
            ves cómo cambia el resultado según el plazo y el precio de venta.
          </p>
        </motion.div>

        <ol className="mx-auto mt-10 flex max-w-xl items-center justify-between gap-2 sm:mt-12">
          {FLOW_STEPS.map((step, i) => (
            <li key={step.n} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/25">
                  {step.n}
                </span>
                <span className="hidden sm:block">
                  <span className="block text-sm font-bold text-foreground">
                    {step.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {step.hint}
                  </span>
                </span>
              </div>
              {i < FLOW_STEPS.length - 1 ? (
                <span
                  className="h-px flex-1 bg-linear-to-r from-primary to-primary/20"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ol>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-xl shadow-primary/8 sm:mt-12"
        >
          <div className="border-b border-primary/15 bg-primary/8 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                01
              </span>
              <div>
                <p className="font-bold text-lg text-foreground sm:text-xl">
                  Elige la operación
                </p>
                <p className="type-caption text-sm! text-pretty text-muted-foreground">
                  Cada ficha usa el retorno estimado publicado para esa
                  oportunidad.
                </p>
              </div>
            </div>

            <fieldset>
              <legend className="sr-only">Operación</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {OPPORTUNITIES.slice(0, 3).map((o, index) => {
                  const isActive = o.id === opportunity.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setSelectedId(o.id)}
                      aria-pressed={isActive}
                      className={cn(
                        "cursor-pointer rounded-2xl border p-4 text-left transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                        isActive
                          ? "border-primary bg-card shadow-md shadow-primary/15 ring-2 ring-primary/20"
                          : "border-border bg-card/60 hover:border-primary/40 hover:bg-card",
                      )}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/80">
                        Opción {index + 1}
                      </p>
                      <p className="type-body mt-1 font-semibold text-foreground">
                        {o.district}
                      </p>
                      <p className="type-caption mt-0.5 truncate text-muted-foreground">
                        {o.name}
                      </p>
                      <p
                        className={cn(
                          "type-caption mt-2 font-semibold",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {formatPercent(o.roi)} anual estimado
                      </p>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="border-b border-border/60 bg-muted/25 p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                02
              </span>
              <p className="font-bold text-lg text-foreground sm:text-xl">
                Define cuánto inviertes
              </p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
              <label
                htmlFor="simulator-amount"
                className="type-label text-muted-foreground"
              >
                Tu aporte
              </label>
              <output
                htmlFor="simulator-amount"
                className="text-3xl font-black tracking-tight text-primary tabular-nums sm:text-4xl"
              >
                {money(amount)}
              </output>
            </div>

            <Slider
              id="simulator-amount"
              className={cn(
                "mt-6",
                "[&_[data-slot=slider-track]]:data-horizontal:h-2.5",
                "[&_[data-slot=slider-range]]:bg-primary",
                "[&_[data-slot=slider-thumb]]:size-5",
                "[&_[data-slot=slider-thumb]]:border-2",
                "[&_[data-slot=slider-thumb]]:border-primary",
                "[&_[data-slot=slider-thumb]]:shadow-md",
                "[&_[data-slot=slider-thumb]]:after:-inset-3",
              )}
              value={[amount]}
              min={opportunity.min}
              max={range.max}
              step={range.step}
              aria-label="Monto a invertir"
              aria-valuetext={money(amount)}
              onValueChange={([next]) =>
                setAmountByCurrency((prev) => ({
                  ...prev,
                  [opportunity.currency]: next ?? opportunity.min,
                }))
              }
            />

            <div className="mt-3 flex justify-between type-caption text-muted-foreground">
              <span>Mínimo {money(opportunity.min)}</span>
              <span>{money(range.max)}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                03
              </span>
              <div>
                <p className="font-bold text-lg text-foreground sm:text-xl">
                  Tres caminos de referencia
                </p>
                <p className="type-caption text-pretty text-muted-foreground">
                  Lee de izquierda a derecha: de un resultado adverso al más
                  favorable. No cubren todos los desenlaces posibles.
                </p>
              </div>
            </div>

            <p className="mb-5 rounded-2xl border border-primary/20 bg-primary/8 px-4 py-3 text-sm leading-relaxed text-foreground">
              Si inviertes{" "}
              <strong className="text-primary">{money(amount)}</strong> en{" "}
              <strong>{opportunity.name}</strong>, este es el recorrido de tu
              capital según el plazo y el precio de venta.
            </p>

            <div
              className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch"
              aria-live="polite"
              aria-atomic="true"
            >
              {results.map((r, i) => {
                const tone = toneStyles[r.scenario.tone];
                const width = `${Math.max(6, (Math.abs(r.netGain) / scale) * 100)}%`;
                const isLoss = r.netGain < 0;

                return (
                  <div key={r.scenario.id} className="contents">
                    <div
                      className={cn(
                        "flex flex-col rounded-2xl border p-5",
                        tone.card,
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("type-label", tone.label)}>
                          {r.scenario.label}
                        </p>
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
                            tone.step,
                          )}
                        >
                          {i + 1}
                        </span>
                      </div>

                      <p className="type-caption mt-1 text-muted-foreground">
                        En {r.scenario.months} meses recibirías
                      </p>
                      <p
                        className={cn(
                          "mt-1.5 text-2xl font-black tracking-tight tabular-nums sm:text-[1.75rem]",
                          tone.value,
                        )}
                      >
                        {money(Math.round(r.net))}
                      </p>

                      <p
                        className={cn(
                          "type-caption mt-1 font-semibold tabular-nums",
                          isLoss ? "text-destructive" : "text-success",
                        )}
                      >
                        {isLoss ? "−" : "+"}
                        {money(Math.abs(Math.round(r.netGain)))} ·{" "}
                        {isLoss ? "−" : "+"}
                        {formatPercent(Math.abs(r.annualised), 1)} anual
                      </p>

                      <div
                        className={cn(
                          "mt-4 h-2 overflow-hidden rounded-full",
                          tone.rail,
                        )}
                      >
                        <div
                          className={cn("h-full rounded-full", tone.bar)}
                          style={{ width }}
                        />
                      </div>

                      <p className="type-caption mt-4 text-pretty text-muted-foreground">
                        {r.scenario.caption}
                      </p>
                    </div>

                    {i < results.length - 1 ? (
                      <div
                        className="hidden items-center justify-center sm:flex"
                        aria-hidden
                      >
                        <ArrowRight className="size-5 text-primary" />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-muted/50 p-5">
              <p className="type-label text-muted-foreground">
                Comisiones incluidas en el escenario esperado
              </p>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                {feeRows.map((fee) => (
                  <div key={fee.concept} className="flex flex-col">
                    <dt className="type-body font-semibold text-foreground">
                      {fee.concept}
                      <span className="block type-caption font-normal text-muted-foreground">
                        {fee.rate}
                      </span>
                    </dt>
                    <dd className="mt-2 text-lg font-bold tabular-nums text-foreground">
                      {fee.value}
                      <span className="block type-caption font-normal text-muted-foreground">
                        en este escenario
                      </span>
                    </dd>
                    <p className="type-caption mt-2 border-t border-border/60 pt-2 text-muted-foreground">
                      {fee.helper}
                    </p>
                  </div>
                ))}
              </dl>
            </div>

            <p className="type-caption mt-5 flex items-start gap-2 text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                Cifras referenciales antes de impuestos, calculadas sobre el
                retorno estimado de la operación y los plazos típicos de cada
                escenario de referencia. No son una proyección ni una garantía:
                el resultado real depende del precio de venta final y del tiempo
                que tome cerrarla.{" "}
                <Link
                  href="/politica-de-riesgos"
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                >
                  Conoce los riesgos
                </Link>{" "}
                y{" "}
                <Link
                  href="/tarifas"
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                >
                  el detalle de comisiones
                </Link>
                .
              </span>
            </p>

            <div className="mt-7 flex flex-col items-center gap-4 border-t border-border/60 pt-6 sm:flex-row sm:justify-between">
              <p className="type-body text-center text-muted-foreground sm:text-left">
                ¿Te interesa esta operación? Abre su ficha completa, sin cuenta.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full font-semibold">
                  <Link href={`/propiedades/${opportunity.slug}`}>
                    Ver esta oportunidad
                    <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full font-semibold"
                >
                  <Link href="/contacto">Hablar con un asesor</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
