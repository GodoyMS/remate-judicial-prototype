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
  LineChart as LineChartIcon,
  Filter,
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
  getMonthsBackForPreset,
  getPaymentMethodDistribution,
  getPremiumSuggestions,
  getRegionalDistribution,
  getTierDistribution,
  getTopInvestors,
  getTopProperties,
  getUserGrowthData,
  groupInvestmentsByMonth,
  DATE_PRESET_LABELS,
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
};

const statusChartConfig = {
  Confirmadas: { label: "Confirmadas", color: "var(--chart-1)" },
  Pendientes: { label: "Pendientes", color: "var(--chart-3)" },
  Rechazadas: { label: "Rechazadas", color: "var(--chart-5)" },
};

const paymentChartConfig = {
  Tarjeta: { label: "Tarjeta", color: "var(--chart-1)" },
  Yape: { label: "Yape", color: "var(--chart-2)" },
  Transferencia: { label: "Transferencia", color: "var(--chart-3)" },
  Depósito: { label: "Depósito", color: "var(--chart-4)" },
};

const currencyChartConfig = {
  "Soles (PEN)": { label: "Soles (PEN)", color: "var(--chart-1)" },
  "Dólares (USD)": { label: "Dólares (USD)", color: "var(--chart-2)" },
};

const growthChartConfig = {
  newUsers: { label: "Nuevos usuarios", color: "var(--chart-2)" },
  cumulative: { label: "Acumulado", color: "var(--chart-1)" },
};

const regionalChartConfig = {
  amount: { label: "Monto", color: "var(--chart-1)" },
};

const REGIONAL_BAR_SIZE = 28;
const REGIONAL_ROW_HEIGHT = 44;
const REGIONAL_CHART_PADDING = 48;

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-[220px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/15 text-center">
      <BarChart3 className="size-7 text-muted-foreground/30" />
      <p className="max-w-[220px] text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

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

  const monthsBack = getMonthsBackForPreset(filters.datePreset);

  const monthlyData = useMemo(
    () => groupInvestmentsByMonth(filteredInvestments, monthsBack),
    [filteredInvestments, monthsBack]
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

  const userGrowth = useMemo(
    () => getUserGrowthData(adminUsers, monthsBack),
    [monthsBack]
  );

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

  const statusPieData = statusDistribution
    .filter((s) => s.count > 0)
    .map((s, i) => ({
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

  const hasMonthly = monthlyData.some((m) => m.total > 0);
  const hasStatus = statusPieData.length > 0;
  const hasPayment = paymentPieData.length > 0;
  const hasCurrency = currencyPieData.length > 0;
  const hasRegional = regionalData.length > 0;
  const totalOperations = monthlyData.reduce((s, m) => s + m.count, 0);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"
      >
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Inteligencia de negocio
          </p>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <BarChart3 className="size-6 text-secondary" />
            Analítica
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Métricas de inversiones, propiedades e inversores organizadas por
            secciones para una lectura clara.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className="gap-1 rounded-lg text-[11px] font-normal">
            <Filter className="size-3" />
            {DATE_PRESET_LABELS[filters.datePreset]}
          </Badge>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg",
                      card.color.split(" ")[0]
                    )}
                  >
                    <card.icon className={cn("size-4", card.color.split(" ")[1])} />
                  </div>
                </div>
                <p className="text-xl font-bold leading-tight text-foreground">{card.value}</p>
                {"change" in card && card.change !== undefined ? (
                  <p
                    className={cn(
                      "mt-1.5 flex items-center gap-1 text-xs font-medium",
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
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{card.sub}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Sectioned dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="sticky top-0 z-10 -mx-1 overflow-x-auto rounded-xl bg-background/80 px-1 py-1 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsList className="h-11 w-max rounded-xl bg-muted/50 p-1 sm:w-auto">
            <TabsTrigger value="overview" className="rounded-lg text-xs sm:text-sm">
              <LineChartIcon className="mr-1.5 size-3.5" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="investments" className="rounded-lg text-xs sm:text-sm">
              <PieChartIcon className="mr-1.5 size-3.5" />
              Inversiones
            </TabsTrigger>
            <TabsTrigger value="geography" className="rounded-lg text-xs sm:text-sm">
              <MapPin className="mr-1.5 size-3.5" />
              Geografía
            </TabsTrigger>
            <TabsTrigger value="ranking" className="rounded-lg text-xs sm:text-sm">
              <Crown className="mr-1.5 size-3.5" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="premium" className="rounded-lg text-xs sm:text-sm">
              <Sparkles className="mr-1.5 size-3.5" />
              Premium
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ---------- RESUMEN ---------- */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-2xl border-border/60 lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Volumen de inversiones</CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      Capital confirmado por mes — PEN y USD por separado
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    <TrendingUp className="mr-1 size-3" />
                    {totalOperations} operaciones
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {hasMonthly ? (
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
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              `${formatCurrency(Number(value), name === "usd" ? "USD" : "PEN")}  `,
                              name === "usd" ? "Dólares (USD)" : "Soles (PEN)",
                            ]}
                          />
                        }
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Area
                        type="monotone"
                        dataKey="pen"
                        stroke="var(--color-pen)"
                        fill="url(#fillPen)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="usd"
                        stroke="var(--color-usd)"
                        fill="url(#fillUsd)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <ChartEmpty message="No hay inversiones confirmadas en el período seleccionado." />
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Embudo de inversiones</CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  De solicitud a confirmación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {funnel.map((step, i) => (
                  <div key={step.step}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{step.step}</span>
                      <span className="font-semibold tabular-nums">
                        {step.count}{" "}
                        <span className="font-normal text-muted-foreground">
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

                <div className="space-y-2 border-t border-border/50 pt-3">
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

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
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
        </TabsContent>

        {/* ---------- INVERSIONES ---------- */}
        <TabsContent value="investments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PieChartIcon className="size-4 text-muted-foreground" />
                  Estado de inversiones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasStatus ? (
                  <>
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
                          {statusPieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                    <div className="mt-2 flex flex-wrap justify-center gap-3">
                      {statusPieData.map((s) => (
                        <div key={s.name} className="flex items-center gap-1.5 text-[11px]">
                          <div className="size-2.5 rounded-full" style={{ background: s.fill }} />
                          <span className="text-muted-foreground">{s.name}</span>
                          <span className="font-semibold">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <ChartEmpty message="Sin inversiones para los filtros aplicados." />
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wallet className="size-4 text-muted-foreground" />
                  Métodos de pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasPayment ? (
                  <>
                    <ChartContainer config={paymentChartConfig} className="h-[220px] w-full">
                      <PieChart>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value, name) => [
                                `${formatCurrency(Number(value))}  `,
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
                    <div className="mt-2 space-y-1.5">
                      {paymentDistribution.map((p) => (
                        <div key={p.method} className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">{p.label}</span>
                          <span className="font-semibold">
                            {formatCurrency(p.amount)} · {p.count} ops
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <ChartEmpty message="Sin pagos confirmados para mostrar." />
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layers className="size-4 text-muted-foreground" />
                  Distribución por moneda
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasCurrency ? (
                  <>
                    <ChartContainer config={currencyChartConfig} className="h-[220px] w-full">
                      <PieChart>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value, name) => [
                                `${formatCurrency(Number(value), name === "Dólares (USD)" ? "USD" : "PEN")}  `,
                                String(name),
                              ]}
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
                    <div className="mt-2 space-y-2">
                      {currencySplit.map((c) => (
                        <div key={c.currency} className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">{c.label}</span>
                          <div className="text-right">
                            <span className="font-semibold">
                              {formatCurrency(c.amount, c.currency)}
                            </span>
                            <span className="ml-1.5 text-muted-foreground">
                              ({c.percentage.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <ChartEmpty message="Sin capital confirmado en el período." />
                )}
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
              <div className="grid gap-6 sm:grid-cols-2">
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
        </TabsContent>

        {/* ---------- GEOGRAFÍA ---------- */}
        <TabsContent value="geography" className="space-y-6">
          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 text-muted-foreground" />
                Inversiones por región
              </CardTitle>
              <CardDescription className="text-xs">
                Volumen confirmado y propiedades activas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasRegional ? (
                <ChartContainer
                  config={regionalChartConfig}
                  className="aspect-auto w-full"
                  style={{
                    height: Math.max(
                      regionalData.length * REGIONAL_ROW_HEIGHT + REGIONAL_CHART_PADDING,
                      160
                    ),
                  }}
                >
                  <BarChart
                    accessibilityLayer
                    data={regionalData}
                    layout="vertical"
                    margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/40" />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      domain={[0, (max: number) => Math.ceil(max * 1.08)]}
                    />
                    <YAxis
                      type="category"
                      dataKey="region"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      width={96}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          formatter={(value) => `${formatCurrency(Number(value))}  `}
                        />
                      }
                    />
                    <Bar
                      dataKey="amount"
                      radius={[0, 6, 6, 0]}
                      barSize={REGIONAL_BAR_SIZE}
                      maxBarSize={REGIONAL_BAR_SIZE}
                    >
                      {regionalData.map((entry, i) => (
                        <Cell
                          key={entry.region}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <ChartEmpty message="Sin inversiones por región para los filtros aplicados." />
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Mapa de calor por distrito</CardTitle>
              <CardDescription className="text-xs">
                Concentración geográfica del capital invertido
              </CardDescription>
            </CardHeader>
            <CardContent>
              {districtHeatmap.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {districtHeatmap.map((d, i) => {
                    const maxAmount = districtHeatmap[0]?.amount ?? 1;
                    const intensity = d.amount / maxAmount;
                    return (
                      <motion.div
                        key={d.district}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
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
                          <Badge variant="outline" className="shrink-0 text-[10px]">
                            {d.count} inv.
                          </Badge>
                        </div>
                        <p className="mt-2 text-lg font-bold tabular-nums">
                          {formatCurrency(d.amount)}
                        </p>
                        <Progress
                          value={intensity * 100}
                          className="mt-2 h-1.5 [&>div]:bg-emerald-500"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <ChartEmpty message="Sin distritos con capital confirmado." />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- RANKING ---------- */}
        <TabsContent value="ranking" className="space-y-6">
          <Card className="overflow-hidden rounded-2xl border-border/60">
            <CardHeader className="border-b border-border/40 bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Propiedades con mayor volumen</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">
                    Ordenadas por capital confirmado en el período seleccionado
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl" asChild>
                  <Link href="/admin/properties">
                    Ver todas
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[40px]">#</TableHead>
                      <TableHead>Propiedad</TableHead>
                      <TableHead className="text-right">Volumen</TableHead>
                      <TableHead className="hidden text-right md:table-cell">Financiado</TableHead>
                      <TableHead className="hidden text-right sm:table-cell">ROI</TableHead>
                      <TableHead className="hidden text-right lg:table-cell">Inversores</TableHead>
                      <TableHead className="w-[100px]">Progreso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProperties.map((p, i) => (
                      <TableRow key={p.id} className="group">
                        <TableCell className="text-xs font-medium text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/properties/${p.id}`}
                            className="flex items-center gap-3 transition-colors group-hover:text-secondary"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image}
                              alt={p.title}
                              className="size-10 shrink-0 rounded-lg object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{p.title}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {p.district}, {p.region}
                              </p>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold tabular-nums">
                          {formatCurrency(p.investmentVolume, p.currency)}
                        </TableCell>
                        <TableCell className="hidden text-right text-sm tabular-nums md:table-cell">
                          {formatCurrency(p.raisedAmount, p.currency)}
                        </TableCell>
                        <TableCell className="hidden text-right sm:table-cell">
                          <span className="text-sm font-semibold text-emerald-600">+{p.roi}%</span>
                        </TableCell>
                        <TableCell className="hidden text-right text-sm tabular-nums lg:table-cell">
                          {p.investorsCount}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={p.progress} className="h-1.5 flex-1" />
                            <span className="w-8 text-right text-[10px] font-medium text-muted-foreground">
                              {p.progress}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {topProperties.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                          Sin propiedades para los filtros aplicados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border-border/60">
            <CardHeader className="border-b border-border/40 bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Inversores más activos</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">
                    Ranking por capital invertido confirmado
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl" asChild>
                  <Link href="/admin/users">
                    Gestionar usuarios
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[40px]">#</TableHead>
                      <TableHead>Inversor</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead className="text-right">Invertido</TableHead>
                      <TableHead className="hidden text-right md:table-cell">Ganancias</TableHead>
                      <TableHead className="hidden text-right sm:table-cell">Inversiones</TableHead>
                      <TableHead className="hidden text-right lg:table-cell">Propiedades</TableHead>
                      <TableHead className="hidden text-right xl:table-cell">Última inv.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topInvestors.map((inv, i) => (
                      <TableRow key={inv.userId}>
                        <TableCell className="text-xs font-medium text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-secondary">
                              {inv.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{inv.name}</p>
                              <p className="truncate text-[11px] text-muted-foreground">
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
                            {inv.tier === "premium" && <Crown className="mr-0.5 size-3" />}
                            {inv.tier === "premium" ? "Premium" : "Standard"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold tabular-nums">
                          {formatCurrency(inv.totalInvested)}
                        </TableCell>
                        <TableCell className="hidden text-right md:table-cell">
                          <span className="text-sm font-medium tabular-nums text-emerald-600">
                            +{formatCurrency(inv.totalGains)}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">
                            {inv.gainsRate.toFixed(1)}% ROI
                          </span>
                        </TableCell>
                        <TableCell className="hidden text-right text-sm tabular-nums sm:table-cell">
                          {inv.investmentCount}
                        </TableCell>
                        <TableCell className="hidden text-right text-sm tabular-nums lg:table-cell">
                          {inv.propertiesCount}
                        </TableCell>
                        <TableCell className="hidden text-right text-[11px] text-muted-foreground xl:table-cell">
                          {formatDate(inv.lastInvestment)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {topInvestors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                          Sin inversores para los filtros aplicados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- PREMIUM ---------- */}
        <TabsContent value="premium" className="space-y-4">
          <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 via-background to-amber-50/20 p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <Sparkles className="size-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Motor de sugerencias Premium
                </h3>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                  El algoritmo analiza capital invertido, frecuencia de inversiones,
                  diversificación de portafolio, rendimiento, verificación KYC y antigüedad
                  para identificar inversores Standard con alto potencial. Puedes activar
                  Premium directamente desde aquí.
                </p>
              </div>
            </div>
          </div>
          <PremiumSuggestionsSection candidates={premiumSuggestions} />
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
          "flex items-center gap-1 font-semibold",
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
