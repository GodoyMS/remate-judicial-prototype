"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { WHATSAPP_URL } from "@/lib/brand";
import {
  PERFORMANCE_RANGES,
  formatSignedPercent,
  getPerformanceSeries,
  type PerformanceRange,
} from "@/lib/dashboard/portfolio-performance";

const chartConfig = {
  value: { label: "Rendimiento", color: "var(--primary)" },
} satisfies ChartConfig;

interface PortfolioOverviewProps {
  firstName: string;
  isPremium: boolean;
}

/** 1. Encabezado y resumen: saludo, rendimiento del portafolio y CTAs. */
export function PortfolioOverview({ firstName, isPremium }: PortfolioOverviewProps) {
  const [range, setRange] = useState<PerformanceRange>("6");
  const series = getPerformanceSeries(range);
  const current = series[series.length - 1].value;
  const periodDelta = current - series[0].value;
  const rangeLabel = PERFORMANCE_RANGES.find((r) => r.value === range)?.label.toLowerCase();

  return (
    <section aria-labelledby="home-greeting" className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 id="home-greeting" className="dash-title text-foreground">
              Buenos días, {firstName} 👋
            </h2>
            {isPremium && <PremiumBadge size="md" />}
          </div>
          <p className="dash-body text-muted-foreground mt-1">
            Aquí tienes un resumen de tu portafolio y las novedades más importantes.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 shrink-0">
          <Button asChild variant="outline" className="h-10 rounded-xl px-4 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary dark:text-accent-foreground dark:hover:text-accent-foreground">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
              Hablar con el equipo
            </a>
          </Button>
          <Button asChild className="h-10 rounded-xl px-4 shadow-sm shadow-primary/20">
            <Link href="/dashboard/properties">
              Ver oportunidades
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] gap-3 rounded-3xl border border-border/60 bg-card p-3 shadow-sm">
        {/* Cifra protagonista: un solo dato dominante sobre primary */}
        <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-5 flex flex-col justify-between gap-6 min-h-40">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 size-40 rounded-full bg-primary-foreground/10"
          />
          <div className="relative flex items-center gap-2">
            <span className="size-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
              <TrendingUp className="size-4" />
            </span>
            <p className="text-sm font-medium text-primary-foreground/85">Rendimiento de tu portafolio</p>
          </div>
          <div className="relative">
            <p className="text-5xl leading-none font-bold tracking-tight tabular-nums">
              {formatSignedPercent(current)}
            </p>
            <p className="dash-caption text-primary-foreground/75 mt-2">
              {formatSignedPercent(periodDelta).replace("%", " pts")} en los {rangeLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-1 pt-1 sm:px-2 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="dash-heading text-foreground">Evolución mensual</p>
              <p className="dash-caption text-muted-foreground">
                Rendimiento acumulado estimado según el avance de tus procesos
              </p>
            </div>
            <Select value={range} onValueChange={(v) => setRange(v as PerformanceRange)}>
              <SelectTrigger size="sm" className="w-auto shrink-0 rounded-lg" aria-label="Periodo del gráfico">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" position="popper">
                {PERFORMANCE_RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ChartContainer config={chartConfig} className="h-44 w-full aspect-auto">
            <AreaChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolio-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 4" stroke="var(--border)" />
              <ReferenceLine y={0} stroke="var(--border)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={48}
                tickFormatter={(v: number) => `${v}%`}
              />
              <ChartTooltip
                cursor={{ stroke: "var(--color-value)", strokeOpacity: 0.3 }}
                content={
                  <ChartTooltipContent
                    hideIndicator
                    formatter={(value) => (
                      <span className="font-semibold tabular-nums text-foreground">
                        {formatSignedPercent(Number(value))}
                      </span>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                fill="url(#portfolio-fill)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </section>
  );
}
