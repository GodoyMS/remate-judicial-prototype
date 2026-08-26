"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { dashboardProperties } from "@/lib/dashboard/mock-data";
import { formatMoney, formatPercent, type PropertyCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

/**
 * Return simulator — audit finding RM-021.
 *
 * "Incorporar un resumen comercial por oportunidad: valor estimado." The
 * property cards state a percentage; this turns that percentage into the only
 * question a reader actually has, which is what their own money would do.
 *
 * Two design decisions worth stating, because they are what keep this from
 * becoming the thing the audit warned about:
 *
 * 1. It shows three outcomes, not one. A simulator that renders only the
 *    favourable number is a sales device dressed as a tool — the exact
 *    "vender rentabilidad sin hablar del downside" pattern flagged in RM-018.
 *    The adverse column is a real loss, computed on the same basis, and it is
 *    given the same visual weight as the others.
 * 2. Fees are inside the arithmetic, not a footnote. The figure shown is what
 *    would land in the reader's account, after the commissions published on
 *    /tarifas — so the number here and the number there can never diverge.
 */

/* Commission schedule — mirrors /tarifas. Kept here as one constant so the two
   surfaces cannot drift apart. */
const FEES = {
  /** One-off, on the invested capital, when the pool closes. */
  structuring: 0.015,
  /** Annual, on capital, prorated over the holding period. */
  management: 0.005,
  /** On the gain only, and only when the gain is positive. */
  success: 0.08,
} as const;

type Scenario = {
  id: string;
  label: string;
  caption: string;
  /** Multiplier applied to the published annual return. Negative = a loss. */
  factor: number;
  months: number;
  tone: "adverse" | "base" | "favourable";
};

/**
 * The three outcomes correspond to the scenarios documented in the risk
 * policy: a below-estimate sale that also ran long, the operation performing
 * as modelled, and a clean sale ahead of schedule.
 */
const SCENARIOS: Scenario[] = [
  {
    id: "adverse",
    label: "Adverso",
    caption: "Venta por debajo de lo estimado y con demora",
    factor: -0.35,
    months: 22,
    tone: "adverse",
  },
  {
    id: "base",
    label: "Esperado",
    caption: "La operación se comporta como fue modelada",
    factor: 1,
    months: 14,
    tone: "base",
  },
  {
    id: "favourable",
    label: "Favorable",
    caption: "Inmueble desocupado y venta antes de lo previsto",
    factor: 1.25,
    months: 12,
    tone: "favourable",
  },
];

const OPPORTUNITIES = dashboardProperties.slice(0, 3).map((p) => ({
  id: p.id,
  name: p.name,
  district: p.district,
  currency: p.currency as PropertyCurrency,
  roi: p.roi,
  min: p.minInvestment,
}));

/** Slider bounds, per currency, so the soles and dollars ranges both make sense. */
const RANGE: Record<PropertyCurrency, { min: number; max: number; step: number }> = {
  PEN: { min: 500, max: 50_000, step: 500 },
  USD: { min: 500, max: 15_000, step: 250 },
};

type Result = {
  scenario: Scenario;
  grossGain: number;
  fees: number;
  net: number;
  netGain: number;
  annualised: number;
};

function simulate(
  amount: number,
  annualRoi: number,
  scenario: Scenario
): Result {
  const years = scenario.months / 12;
  const grossGain = amount * (annualRoi / 100) * years * scenario.factor;

  const structuring = amount * FEES.structuring;
  const management = amount * FEES.management * years;
  const success = grossGain > 0 ? grossGain * FEES.success : 0;
  const fees = structuring + management + success;

  const net = amount + grossGain - fees;
  const netGain = net - amount;

  return {
    scenario,
    grossGain,
    fees,
    net,
    netGain,
    annualised: amount > 0 ? (netGain / amount / years) * 100 : 0,
  };
}

const toneStyles = {
  adverse: {
    card: "border-destructive/25 bg-destructive/5",
    label: "text-destructive",
    value: "text-destructive",
    bar: "bg-destructive/60",
  },
  base: {
    card: "border-primary/40 bg-primary/5 ring-1 ring-primary/20",
    label: "text-primary",
    value: "text-foreground",
    bar: "bg-primary",
  },
  favourable: {
    card: "border-success/30 bg-success/5",
    label: "text-success",
    value: "text-foreground",
    bar: "bg-success",
  },
} as const;

export function ReturnSimulator() {
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState(OPPORTUNITIES[0]!.id);
  const opportunity =
    OPPORTUNITIES.find((o) => o.id === selectedId) ?? OPPORTUNITIES[0]!;
  const range = RANGE[opportunity.currency];

  const [amountByCurrency, setAmountByCurrency] = useState<
    Record<PropertyCurrency, number>
  >({ PEN: 5_000, USD: 3_000 });

  /* Clamped so switching to an opportunity with a higher minimum never leaves
     the slider showing a ticket that opportunity would not accept. */
  const amount = Math.min(
    range.max,
    Math.max(opportunity.min, amountByCurrency[opportunity.currency])
  );

  const results = useMemo(
    () => SCENARIOS.map((s) => simulate(amount, opportunity.roi, s)),
    [amount, opportunity.roi]
  );

  /* Bars are scaled against the largest absolute net gain on screen, so the
     adverse column is legible next to the favourable one. */
  const scale = Math.max(...results.map((r) => Math.abs(r.netGain)), 1);

  const money = (value: number) => formatMoney(value, opportunity.currency);

  return (
    <section
      id="simulador"
      data-nav-tone="light"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
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
            ¿Qué pasaría con{" "}
            <span className="text-primary">tu dinero</span>?
          </h2>
          <p className="type-lead mt-4 text-pretty text-muted-foreground">
            Elige una operación abierta y un monto. Verás los tres escenarios
            posibles, ya con las comisiones descontadas.
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg shadow-foreground/5"
        >
          {/* ── Controls ── */}
          <div className="border-b border-border/60 bg-muted/30 p-6 sm:p-8">
            <fieldset>
              <legend className="type-label text-muted-foreground">
                Operación
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {OPPORTUNITIES.map((o) => {
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
                          ? "border-primary bg-card shadow-sm ring-1 ring-primary/25"
                          : "border-border bg-card/60 hover:border-primary/40 hover:bg-card"
                      )}
                    >
                      <p className="type-body font-semibold text-foreground">
                        {o.district}
                      </p>
                      <p className="type-caption mt-0.5 truncate text-muted-foreground">
                        {o.name}
                      </p>
                      <p
                        className={cn(
                          "type-caption mt-2 font-semibold",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {formatPercent(o.roi)} anual estimado
                      </p>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <label
                  htmlFor="simulator-amount"
                  className="type-label text-muted-foreground"
                >
                  Cuánto inviertes
                </label>
                <output
                  htmlFor="simulator-amount"
                  className="type-metric text-primary"
                >
                  {money(amount)}
                </output>
              </div>

              {/* The shared Slider ships a 12px thumb on a 4px track, which is
                  fine inside a dense dashboard form but under-sized for a
                  primary marketing control on touch. Enlarged here to a 20px
                  thumb with a 44px hit area. */}
              <Slider
                id="simulator-amount"
                className={cn(
                  "mt-5",
                  "[&_[data-slot=slider-track]]:data-horizontal:h-2",
                  "[&_[data-slot=slider-thumb]]:size-5",
                  "[&_[data-slot=slider-thumb]]:border-2",
                  "[&_[data-slot=slider-thumb]]:border-primary",
                  "[&_[data-slot=slider-thumb]]:shadow-md",
                  "[&_[data-slot=slider-thumb]]:after:-inset-3"
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
          </div>

          {/* ── Results ── */}
          <div className="p-6 sm:p-8">
            <div
              className="grid gap-3 sm:grid-cols-3"
              aria-live="polite"
              aria-atomic="true"
            >
              {results.map((r) => {
                const tone = toneStyles[r.scenario.tone];
                const width = `${Math.max(6, (Math.abs(r.netGain) / scale) * 100)}%`;
                const isLoss = r.netGain < 0;

                return (
                  <div
                    key={r.scenario.id}
                    className={cn(
                      "flex flex-col rounded-2xl border p-5",
                      tone.card
                    )}
                  >
                    <p className={cn("type-label", tone.label)}>
                      {r.scenario.label}
                    </p>

                    <p className="type-caption mt-1 text-muted-foreground">
                      En {r.scenario.months} meses recibirías
                    </p>
                    <p
                      className={cn(
                        "mt-1.5 text-2xl font-black tracking-tight tabular-nums sm:text-[1.75rem]",
                        tone.value
                      )}
                    >
                      {money(Math.round(r.net))}
                    </p>

                    <p
                      className={cn(
                        "type-caption mt-1 font-semibold tabular-nums",
                        isLoss ? "text-destructive" : "text-success"
                      )}
                    >
                      {isLoss ? "−" : "+"}
                      {money(Math.abs(Math.round(r.netGain)))} ·{" "}
                      {isLoss ? "−" : "+"}
                      {formatPercent(Math.abs(r.annualised), 1)} anual
                    </p>

                    {/* Magnitude bar — same scale across the three columns */}
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-foreground/8">
                      <div
                        className={cn("h-full rounded-full", tone.bar)}
                        style={{ width }}
                      />
                    </div>

                    <p className="type-caption mt-4 text-pretty text-muted-foreground">
                      {r.scenario.caption}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Fee transparency — same numbers as /tarifas, and reachable */}
            <dl className="mt-6 grid gap-3 rounded-2xl bg-muted/50 p-5 sm:grid-cols-3">
              <div>
                <dt className="type-caption text-muted-foreground">
                  Estructuración ({formatPercent(FEES.structuring * 100, 1)})
                </dt>
                <dd className="type-body font-semibold text-foreground">
                  {money(Math.round(amount * FEES.structuring))}
                </dd>
              </div>
              <div>
                <dt className="type-caption text-muted-foreground">
                  Gestión ({formatPercent(FEES.management * 100, 1)} anual)
                </dt>
                <dd className="type-body font-semibold text-foreground">
                  {money(
                    Math.round(
                      amount * FEES.management * (results[1]!.scenario.months / 12)
                    )
                  )}
                </dd>
              </div>
              <div>
                <dt className="type-caption text-muted-foreground">
                  Éxito ({formatPercent(FEES.success * 100)} de la ganancia)
                </dt>
                <dd className="type-body font-semibold text-foreground">
                  {money(Math.round(Math.max(0, results[1]!.grossGain) * FEES.success))}
                  <span className="block type-caption font-normal text-muted-foreground">
                    cero si no hay ganancia
                  </span>
                </dd>
              </div>
            </dl>

            <p className="type-caption mt-5 flex items-start gap-2 text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                Cifras referenciales antes de impuestos, calculadas sobre el
                retorno estimado de la operación y los plazos típicos de cada
                escenario. No son una proyección ni una garantía: el resultado
                real depende del precio de venta final y del tiempo que tome
                cerrarla.{" "}
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
                Crear tu cuenta es gratis y no te obliga a invertir.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full font-semibold">
                  <Link href="/register">
                    Crear cuenta gratis
                    <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full font-semibold"
                >
                  <Link href="/contacto">Hablar con el equipo</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
