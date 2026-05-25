"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Building2,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const summaryCards = [
  {
    label: "Total invertido",
    value: "S/ 12,500",
    change: "+S/ 2,300 este mes",
    changePositive: true,
    icon: Wallet,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Inversiones activas",
    value: "4",
    change: "2 en proceso de subasta",
    changePositive: null,
    icon: Building2,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Retornos generados",
    value: "S/ 2,847",
    change: "+22.7% retorno acumulado",
    changePositive: true,
    icon: TrendingUp,
    color: "bg-green-50 text-green-600",
  },
];

const activeInvestments = [
  {
    id: 1,
    name: "Dept. San Isidro 3B",
    address: "Av. Javier Prado Este 1240",
    invested: "S/ 3,500",
    roi: "+21%",
    status: "Subasta activa",
    statusColor: "text-green-600 bg-green-50",
    deadline: "8 días",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=80&h=80&fit=crop",
  },
  {
    id: 2,
    name: "Casa Los Olivos",
    address: "Jr. Las Casuarinas 350, La Molina",
    invested: "S/ 5,000",
    roi: "+17%",
    status: "En revisión legal",
    statusColor: "text-amber-600 bg-amber-50",
    deadline: "15 días",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    name: "Penthouse Miraflores",
    address: "Calle Berlín 847, Miraflores",
    invested: "S/ 2,500",
    roi: "+20%",
    status: "Adjudicado",
    statusColor: "text-primary bg-primary/10",
    deadline: "Completado",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=80&h=80&fit=crop",
  },
  {
    id: 4,
    name: "Oficina San Borja",
    address: "Av. Angamos Oeste 600",
    invested: "S/ 1,500",
    roi: "+18%",
    status: "Subasta activa",
    statusColor: "text-green-600 bg-green-50",
    deadline: "22 días",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&h=80&fit=crop",
  },
];

const activityFeed = [
  {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    message: "Inversión confirmada en Casa Los Olivos",
    time: "hace 2 horas",
  },
  {
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    message: "Nuevo documento disponible: Penthouse Miraflores",
    time: "hace 5 horas",
  },
  {
    icon: TrendingUp,
    color: "text-secondary",
    bg: "bg-primary/30",
    message: "Retorno de S/ 420 acreditado — Dept. San Isidro",
    time: "ayer",
  },
  {
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    message: "Nueva subasta disponible en Surco",
    time: "hace 2 días",
  },
  {
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-white/20",
    message: "Verificación de identidad completada",
    time: "hace 3 días",
  },
];

export default function DashboardPage() {
  return (
    <div className="w-full">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Buenos días, Ana Sofía 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tu portafolio está rindiendo un <strong className="text-green-600">+22.7%</strong> este año.
          </p>
        </div>
        <Button
          asChild
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          <Link href="/dashboard/invest">
            Nueva inversión
            <ArrowRight className="size-4 ml-1" />
          </Link>
        </Button>
      </motion.div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-2xl border border-border/60 bg-secondary/5 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <div className={`size-9 rounded-xl flex items-center justify-center ${c.color.split(" ")[0]}`}>
                <c.icon className={`size-4 ${c.color.split(" ")[1]}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              <p
                className={`text-xs mt-1 flex items-center gap-1 ${
                  c.changePositive === true
                    ? "text-green-600"
                    : c.changePositive === false
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {c.changePositive !== null && (
                  <ArrowUpRight className="size-3" />
                )}
                {c.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active investments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Inversiones activas</h3>
            <Link
              href="/dashboard/my-investments"
              className="text-xs font-medium text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1"
            >
              Ver todas
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {activeInvestments.map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.2 }}
                className="flex items-center gap-4 rounded-2xl  p-4 hover:bg-secondary/8 transition-shadow group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={inv.img}
                  alt={inv.name}
                  className="size-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{inv.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{inv.address}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${inv.statusColor}`}>
                      {inv.status}
                    </span>
                    {inv.deadline !== "Completado" && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="size-2.5" />
                        {inv.deadline}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{inv.invested}</p>
                  <p className="text-xs font-medium text-green-600">{inv.roi} est.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Actividad reciente</h3>
          </div>
          <div className="rounded-2xl border border-border/60 bg-secondary/5 p-4 flex flex-col">
            {activityFeed.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 py-3 ${
                  i < activityFeed.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${a.bg}`}>
                  <a.icon className={`size-3.5 ${a.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{a.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
