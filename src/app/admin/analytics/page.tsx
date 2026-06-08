"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Target,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Wallet,
  Activity,
  Sparkles,
  ChevronRight,
  Percent,
  Layers,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { AdminFiltersShell } from "@/components/admin/AdminFiltersShell";
import { AnalyticsFiltersContent } from "@/components/admin/AnalyticsFiltersContent";
import { PremiumSuggestionsSection } from "@/components/admin/PremiumSuggestionsSection";
import {
  computeAnalyticsKpis,
  countAnalyticsActiveFilters,
  defaultAnalyticsFilters,
  filterInvestmentsForAnalytics,
  filterPropertiesForAnalytics,
  getCurrencySplit,
  getDistrictHeatmap,
  getInvestmentFunnel,
  getInvestmentStatusDistribution,
  getPaymentMethodDistribution,
  getPremiumSuggestions,
  getRegionalDistribution,
  getTierDistribution,
  getTopInvestors,
  getTopProperties,
  getUserGrowthData,
  groupInvestmentsByMonth,
  type AnalyticsFilterState,
} from "@/lib/admin/analytics";
import { formatCurrency, formatDate } from "@/lib/admin/formatters";
import { adminProperties, adminUsers, propertyInvestments } from "@/lib/admin/mock-data";
import { formatMixedCurrencyTotals } from "@/lib/currency";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const monthlyChartConfig = {
  pen: { label: "Soles (PEN)", color: "var(--chart-1)" },
  usd: { label: "Dólares (USD)", color: "var(--chart-2)" },
  total: { label: "Total", color: "var(--chart-3)" },
};

const statusChartConfig = {
  confirmed: { label: "Confirmadas", color: "var(--chart-1)" },
  pending: { label: "Pendientes", color: "var(--chart-3)" },
  rejected: { label: "Rechazadas", color: "var(--chart-5)" },
};

const paymentChartConfig = {
  card: { label: "Tarjeta", color: "var(--chart-1)" },
  yape: { label: "Yape", color: "var(--chart-2)" },
  transfer: { label: "Transferencia", color: "var(--chart-3)" },
  deposit: { label: "Depósito", color: "var(--chart-4)" },
};

const growthChartConfig = {
  newUsers: { label: "Nuevos usuarios", color: "var(--chart-2)" },
  cumulative: { label: "Acumulado", color: "var(--chart-1)" },
};

export default function AdminAnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilterState>(defaultAnalyticsFilters);

  const filteredInvestments = useMemo(
    () => filterInvestmentsForAnalytics(propertyInvestments, adminProperties, filters),
    [filters]
  );

  const filteredProperties = useMemo(
    () => filterPropertiesForAnalytics(adminProperties, filters),
    [filters]
  );

  const kpis = useMemo(
    () => computeAnalyticsKpis(filteredInvestments, filteredProperties, adminUsers),
    [filteredInvestments, filteredProperties]
  );

  const monthlyData = useMemo(
    () => groupInvestmentsByMonth(filteredInvestments),
    [filteredInvestments]
  );

  const statusDistribution = useMemo(
    () => getInvestmentStatusDistribution(filteredInvestments),
    [filteredInvestments]
  );

  const paymentDistribution = useMemo(
    () => getPaymentMethodDistribution(filteredInvestments),
    [filteredInvestments]
  );

  const regionalData = useMemo(
    () => getRegionalDistribution(filteredInvestments, filteredProperties),
    [filteredInvestments, filteredProperties]
  );

  const topProperties = useMemo(
    () => getTopProperties(filteredProperties, filteredInvestments),
    [filteredProperties, filteredInvestments]
  );

  const topInvestors = useMemo(
    () => getTopInvestors(filteredInvestments, adminUsers),
    [filteredInvestments]
  );

  const userGrowth = useMemo(() => getUserGrowthData(adminUsers), []);

  const tierDistribution = useMemo(
    () => getTierDistribution(adminUsers, filteredInvestments),
    [filteredInvestments]
  );

  const funnel = useMemo(
    () => getInvestmentFunnel(filteredInvestments),
    [filteredInvestments]
  );

  const currencySplit = useMemo(
    () => getCurrencySplit(filteredInvestments),
    [filteredInvestments]
  );

  const districtHeatmap = useMemo(
    () => getDistrictHeatmap(filteredInvestments, filteredProperties),
    [filteredInvestments, filteredProperties]
  );

  const premiumSuggestions = useMemo(
    () => getPremiumSuggestions(propertyInvestments, adminUsers),
    []
  );

  const activeFilterCount = countAnalyticsActiveFilters(filters);

  const kpiCards = [
    {
      label: "Capital invertido",
      value: formatMixedCurrencyTotals(kpis.totalInvested),
      change: kpis.investmentGrowth,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
      positive: kpis.investmentGrowth >= 0,
    },
    {
      label: "Inversores activos",
      value: String(kpis.uniqueInvestors),
      sub: `${kpis.avgInvestmentsPerUser.toFixed(1)} inv. promedio c/u`,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Tasa de conversión",
      value: `${kpis.conversionRate.toFixed(1)}%`,
      sub: `${kpis.confirmedCount} confirmadas / ${kpis.confirmedCount + kpis.pendingCount + kpis.rejectedCount} total`,
      icon: Target,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Ticket promedio",
      value: formatCurrency(kpis.avgInvestment),
      sub: `Ganancias totales: ${formatCurrency(kpis.totalGains)}`,
      icon: Wallet,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Propiedades financiadas",
      value: `${kpis.fundedProperties}/${kpis.totalProperties}`,
      sub: `${kpis.avgFundingProgress.toFixed(0)}% progreso promedio`,
      icon: Building2,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "ROI promedio",
      value: `${kpis.avgRoi.toFixed(1)}%`,
      sub: "Sobre propiedades activas",
      icon: Percent,
      color: "bg-teal-50 text-teal-600",
    },
    {
      label: "Usuarios Premium",
      value: String(kpis.premiumUsers),
      sub: `${kpis.standardUsers} usuarios Standard`,
      icon: Crown,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Pendientes de verificación",
      value: String(kpis.pendingCount),
      sub: `${kpis.rejectedCount} rechazadas en el período`,
      icon: Activity,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const statusPieData = statusDistribution.map((s, i) => ({
    name: s.label,
    value: s.count,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const paymentPieData = paymentDistribution.map((p, i) => ({
    name: p.label,
    value: p.amount,
    count: p.count,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const currencyPieData = currencySplit.map((c, i) => ({
    name: c.label,
    value: c.amount,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Inteligencia de negocio
          </p>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BarChart3 className="size-6 text-secondary" />
            Analítica
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Dashboard completo de inversiones, propiedades e inversores. Identifica tendencias,
            oportunidades y candidatos Premium.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AdminFiltersShell
            activeCount={activeFilterCount}
            onClear={() => setFilters(defaultAnalyticsFilters)}
            title="Filtros de analítica"
            description="Refina métricas por período, región y moneda"
            popoverClassName="w-[min(100vw-2rem,420px)]"
          >
            <AnalyticsFiltersContent filters={filters} onChange={setFilters} />
          </AdminFiltersShell>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
                  <div
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center",
                      card.color.split(" ")[0]
                    )}
                  >
                    <card.icon className={cn("size-4", card.color.split(" ")[1])} />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground leading-tight">{card.value}</p>
                {"change" in card && card.change !== undefined ? (
                  <p
                    className={cn(
                      "text-xs mt-1.5 flex items-center gap-1 font-medium",
                      card.positive ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {card.positive ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownRight className="size-3" />
                    )}
                    {card.positive ? "+" : ""}
                    {card.change.toFixed(1)}% vs mes anterior
                  </p>
                ) : (
                  <p className="text-[11px] mt-1.5 text-muted-foreground">{card.sub}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Volumen de inversiones</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Capital confirmado por mes — PEN y USD
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                <TrendingUp className="size-3 mr-1" />
                {monthlyData.reduce((s, m) => s + m.count, 0)} operaciones
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyChartConfig} className="h-[280px] w-full">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillPen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-pen)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-pen)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillUsd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-usd)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-usd)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="pen"
                  stackId="1"
                  stroke="var(--color-pen)"
                  fill="url(#fillPen)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="usd"
                  stackId="1"
                  stroke="var(--color-usd)"
                  fill="url(#fillUsd)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Embudo de inversiones</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              De solicitud a confirmación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {funnel.map((step, i) => (
              <div key={step.step}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{step.step}</span>
                  <span className="font-semibold tabular-nums">
                    {step.count}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({step.percentage.toFixed(0)}%)
                    </span>
                  </span>
                </div>
                <Progress
                  value={step.percentage}
                  className={cn(
                    "h-3",
                    i === funnel.length - 1 && "[&>div]:bg-emerald-500",
                    i === 0 && "[&>div]:bg-blue-500"
                  )}
                />
              </div>
            ))}

            <div className="pt-3 border-t border-border/50 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Análisis rápido
              </p>
              <InsightRow
                label="Tasa de aprobación"
                value={`${kpis.conversionRate.toFixed(1)}%`}
                positive={kpis.conversionRate >= 70}
              />
              <InsightRow
                label="Rechazos"
                value={`${kpis.rejectedCount} (${filteredInvestments.length > 0 ? ((kpis.rejectedCount / filteredInvestments.length) * 100).toFixed(0) : 0}%)`}
                positive={kpis.rejectedCount < kpis.confirmedCount * 0.1}
              />
              <InsightRow
                label="En cola"
                value={String(kpis.pendingCount)}
                positive={kpis.pendingCount <= 5}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChartIcon className="size-4 text-muted-foreground" />
              Estado de inversiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className="h-[220px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {statusPieData.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {statusDistribution.map((s, i) => (
                <div key={s.status} className="flex items-center gap-1.5 text-[11px]">
                  <div
                    className="size-2.5 rounded-full"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="size-4 text-muted-foreground" />
              Métodos de pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={paymentChartConfig} className="h-[220px] w-full">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        formatCurrency(Number(value)),
                        String(name),
                      ]}
                    />
                  }
                />
                <Pie
                  data={paymentPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {paymentPieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="space-y-1.5 mt-2">
              {paymentDistribution.map((p) => (
                <div key={p.method} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="font-semibold">
                    {formatCurrency(p.amount)} · {p.count} ops
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="size-4 text-muted-foreground" />
              Distribución por moneda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={paymentChartConfig} className="h-[220px] w-full">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Pie
                  data={currencyPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {currencyPieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="space-y-2 mt-2">
              {currencySplit.map((c) => (
                <div key={c.currency} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{c.label}</span>
                  <div className="text-right">
                    <span className="font-semibold">
                      {formatCurrency(c.amount, c.currency)}
                    </span>
                    <span className="text-muted-foreground ml-1.5">
                      ({c.percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional + User Growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              Inversiones por región
            </CardTitle>
            <CardDescription className="text-xs">
              Volumen confirmado y propiedades activas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ amount: { label: "Monto", color: "var(--chart-1)" } }}
              className="h-[260px] w-full"
            >
              <BarChart
                data={regionalData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/40" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  width={70}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              Crecimiento de usuarios
            </CardTitle>
            <CardDescription className="text-xs">
              Nuevos registros y base acumulada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={growthChartConfig} className="h-[260px] w-full">
              <LineChart data={userGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="var(--color-newUsers)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--color-newUsers)" }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="var(--color-cumulative)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tier comparison insight */}
      <Card className="rounded-2xl border-border/60 bg-gradient-to-r from-amber-50/40 via-background to-blue-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Premium vs Standard — impacto en inversiones</CardTitle>
          <CardDescription className="text-xs">
            Comparativa de capital aportado por tipo de plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            {tierDistribution.map((tier) => {
              const maxInvested = Math.max(...tierDistribution.map((t) => t.totalInvested), 1);
              const pct = (tier.totalInvested / maxInvested) * 100;
              return (
                <div key={tier.tier} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tier.tier === "premium" ? (
                        <Crown className="size-4 text-amber-600" />
                      ) : (
                        <Users className="size-4 text-slate-500" />
                      )}
                      <span className="text-sm font-semibold">{tier.label}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {tier.count} usuarios
                      </Badge>
                    </div>
                    <span className="text-sm font-bold">
                      {formatCurrency(tier.totalInvested)}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className={cn(
                      "h-3",
                      tier.tier === "premium" ? "[&>div]:bg-amber-500" : "[&>div]:bg-slate-400"
                    )}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {tier.count > 0
                      ? `Promedio ${formatCurrency(tier.totalInvested / tier.count)} por usuario`
                      : "Sin usuarios activos"}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabbed deep-dive sections */}
      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="rounded-xl h-11 p-1 bg-muted/50">
          <TabsTrigger value="properties" className="rounded-lg text-xs sm:text-sm">
            <Building2 className="size-3.5 mr-1.5" />
            Top propiedades
          </TabsTrigger>
          <TabsTrigger value="investors" className="rounded-lg text-xs sm:text-sm">
            <Users className="size-3.5 mr-1.5" />
            Top inversores
          </TabsTrigger>
          <TabsTrigger value="districts" className="rounded-lg text-xs sm:text-sm">
            <MapPin className="size-3.5 mr-1.5" />
            Por distrito
          </TabsTrigger>
          <TabsTrigger value="premium" className="rounded-lg text-xs sm:text-sm">
            <Sparkles className="size-3.5 mr-1.5" />
            Sugerencias Premium
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Propiedades con mayor volumen</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Ordenadas por capital confirmado en el período seleccionado
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl" asChild>
                  <Link href="/admin/properties">
                    Ver todas
                    <ChevronRight className="size-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[40px]">#</TableHead>
                    <TableHead>Propiedad</TableHead>
                    <TableHead className="text-right">Volumen</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Financiado</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">ROI</TableHead>
                    <TableHead className="text-right hidden lg:table-cell">Inversores</TableHead>
                    <TableHead className="w-[100px]">Progreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProperties.map((p, i) => (
                    <TableRow key={p.id} className="group">
                      <TableCell className="font-medium text-muted-foreground text-xs">
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/properties/${p.id}`}
                          className="flex items-center gap-3 group-hover:text-secondary transition-colors"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.title}
                            className="size-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{p.title}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {p.district}, {p.region}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm tabular-nums">
                        {formatCurrency(p.investmentVolume, p.currency)}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell text-sm tabular-nums">
                        {formatCurrency(p.raisedAmount, p.currency)}
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        <span className="text-emerald-600 font-semibold text-sm">+{p.roi}%</span>
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell text-sm tabular-nums">
                        {p.investorsCount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={p.progress} className="h-1.5 flex-1" />
                          <span className="text-[10px] font-medium text-muted-foreground w-8 text-right">
                            {p.progress}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investors">
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Inversores más activos</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Ranking por capital invertido confirmado
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl" asChild>
                  <Link href="/admin/users">
                    Gestionar usuarios
                    <ChevronRight className="size-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[40px]">#</TableHead>
                    <TableHead>Inversor</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Invertido</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Ganancias</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Inversiones</TableHead>
                    <TableHead className="text-right hidden lg:table-cell">Propiedades</TableHead>
                    <TableHead className="text-right hidden xl:table-cell">Última inv.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topInvestors.map((inv, i) => (
                    <TableRow key={inv.userId}>
                      <TableCell className="font-medium text-muted-foreground text-xs">
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-secondary shrink-0">
                            {inv.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{inv.name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {inv.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={inv.tier === "premium" ? "default" : "outline"}
                          className="text-[10px]"
                        >
                          {inv.tier === "premium" && <Crown className="size-3 mr-0.5" />}
                          {inv.tier === "premium" ? "Premium" : "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm tabular-nums">
                        {formatCurrency(inv.totalInvested)}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        <span className="text-emerald-600 font-medium text-sm tabular-nums">
                          +{formatCurrency(inv.totalGains)}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {inv.gainsRate.toFixed(1)}% ROI
                        </span>
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell text-sm tabular-nums">
                        {inv.investmentCount}
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell text-sm tabular-nums">
                        {inv.propertiesCount}
                      </TableCell>
                      <TableCell className="text-right hidden xl:table-cell text-[11px] text-muted-foreground">
                        {formatDate(inv.lastInvestment)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="districts">
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Mapa de calor por distrito</CardTitle>
              <CardDescription className="text-xs">
                Concentración geográfica del capital invertido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {districtHeatmap.map((d, i) => {
                  const maxAmount = districtHeatmap[0]?.amount ?? 1;
                  const intensity = d.amount / maxAmount;
                  return (
                    <motion.div
                      key={d.district}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={cn(
                        "rounded-xl border p-4 transition-all",
                        intensity > 0.7
                          ? "border-emerald-200 bg-emerald-50/60"
                          : intensity > 0.4
                            ? "border-blue-200 bg-blue-50/40"
                            : "border-border/60 bg-muted/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{d.district}</p>
                          <p className="text-[11px] text-muted-foreground">{d.region}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {d.count} inv.
                        </Badge>
                      </div>
                      <p className="text-lg font-bold mt-2 tabular-nums">
                        {formatCurrency(d.amount)}
                      </p>
                      <Progress
                        value={intensity * 100}
                        className="h-1.5 mt-2 [&>div]:bg-emerald-500"
                      />
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="premium">
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 via-background to-amber-50/20 p-5">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Sparkles className="size-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Motor de sugerencias Premium
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                    El algoritmo analiza capital invertido, frecuencia de inversiones,
                    diversificación de portafolio, rendimiento, verificación KYC y antigüedad
                    para identificar inversores Standard con alto potencial. Puedes activar
                    Premium directamente desde aquí.
                  </p>
                </div>
              </div>
            </div>
            <PremiumSuggestionsSection candidates={premiumSuggestions} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InsightRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-semibold flex items-center gap-1",
          positive ? "text-emerald-600" : "text-amber-600"
        )}
      >
        {positive ? (
          <TrendingUp className="size-3" />
        ) : (
          <TrendingDown className="size-3" />
        )}
        {value}
      </span>
    </div>
  );
}
