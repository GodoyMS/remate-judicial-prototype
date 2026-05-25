"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ArrowUpRight,
  Plus,
  UserPlus,
  Star,
  Activity,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  adminProperties,
  adminUsers,
  dashboardKpis,
  investmentChartData,
} from "@/lib/admin/mock-data";
import { formatCurrency } from "@/lib/admin/formatters";

const kpiCards = [
  {
    label: "Usuarios registrados",
    value: dashboardKpis.totalUsers.toLocaleString("es-PE"),
    change: `+${dashboardKpis.usersGrowth}% este mes`,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Capital invertido",
    value: formatCurrency(dashboardKpis.totalInvested),
    change: `+${dashboardKpis.investedGrowth}% vs mes anterior`,
    icon: TrendingUp,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Propiedades activas",
    value: String(dashboardKpis.activeProperties),
    change: `+${dashboardKpis.propertiesGrowth} nuevas este mes`,
    icon: Building2,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Ingresos del mes",
    value: formatCurrency(dashboardKpis.monthlyRevenue),
    change: `+${dashboardKpis.revenueGrowth}% crecimiento`,
    icon: DollarSign,
    color: "bg-purple-50 text-purple-600",
  },
];

const quickActions = [
  { label: "Nueva propiedad", href: "/admin/properties", icon: Plus, primary: true },
  { label: "Gestionar usuarios", href: "/admin/users", icon: UserPlus, primary: false },
  { label: "Ver propiedades", href: "/admin/properties", icon: Building2, primary: false },
  { label: "Configuración", href: "/admin/settings", icon: Activity, primary: false },
];

const recentActivity = [
  { message: "Nueva inversión de S/ 10,000 en Dept. San Isidro", user: "María Elena V.", time: "hace 2h" },
  { message: "Usuario Roberto Silva bloqueado", user: "Sistema", time: "hace 4h" },
  { message: "Propiedad Penthouse Miraflores creada como borrador", user: "Valentina R.", time: "hace 6h" },
  { message: "5 nuevos usuarios registrados hoy", user: "Sistema", time: "hace 8h" },
];

const chartConfig = {
  amount: { label: "Inversiones", color: "var(--chart-1)" },
};

export default function AdminDashboardPage() {
  const featured = adminProperties.filter((p) => p.featured);
  const recentUsers = adminUsers.slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Panel de control
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Resumen de operaciones — <strong className="text-foreground">22 May 2026</strong>
          </p>
        </div>
        <Button asChild className="rounded-xl font-semibold">
          <Link href="/admin/properties">
            <Plus className="size-4 mr-1" />
            Nueva propiedad
          </Link>
        </Button>
      </motion.div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">{c.label}</span>
                  <div className={`size-9 rounded-xl flex items-center justify-center ${c.color.split(" ")[0]}`}>
                    <c.icon className={`size-4 ${c.color.split(" ")[1]}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
                <p className="text-xs mt-1 text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="size-3" />
                  {c.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Inversiones mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <BarChart data={investmentChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                asChild
                variant={action.primary ? "default" : "outline"}
                className="rounded-xl justify-start h-10"
              >
                <Link href={action.href}>
                  <action.icon className="size-4 mr-2" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Star className="size-4 text-amber-500" />
              Propiedades destacadas
            </h3>
            <Link href="/admin/properties" className="text-xs font-medium text-secondary hover:text-secondary/80 flex items-center gap-1">
              Ver todas <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {featured.map((p, i) => {
              const progress = Math.round((p.raisedAmount / p.totalInvestment) * 100);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={`/admin/properties/${p.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white p-4 hover:shadow-md transition-all group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.title} className="size-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate">{p.title}</p>
                        <Badge variant={p.published ? "default" : "outline"} className="text-[10px] shrink-0">
                          {p.published ? "Publicada" : "Borrador"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{p.district}, {p.region}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={progress} className="h-1.5 flex-1" />
                        <span className="text-[10px] font-medium text-muted-foreground shrink-0">{progress}%</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-sm font-semibold">{formatCurrency(p.raisedAmount)}</p>
                      <p className="text-xs text-green-600">+{p.roi}% ROI</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Usuarios recientes</h3>
              <Link href="/admin/users" className="text-xs font-medium text-secondary hover:text-secondary/80 flex items-center gap-1">
                Ver todos <ArrowRight className="size-3" />
              </Link>
            </div>
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-0">
                {recentUsers.map((u, i) => (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 px-4 py-3 ${i < recentUsers.length - 1 ? "border-b border-border/50" : ""}`}
                  >
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                      {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant={u.tier === "premium" ? "default" : "outline"} className="text-[9px] shrink-0">
                      {u.tier}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-4">Actividad reciente</h3>
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-4">
                {recentActivity.map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 py-2.5 ${i < recentActivity.length - 1 ? "border-b border-border/50" : ""}`}
                  >
                    <div className="size-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Activity className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-relaxed">{a.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="size-2.5" />
                        {a.user} · {a.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
