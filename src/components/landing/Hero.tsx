"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, TrendingUp, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "S/ 48M+", label: "en propiedades subastadas" },
  { value: "3,200+", label: "inversores activos" },
  { value: "94%", label: "tasa de éxito" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 size-[600px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute top-1/2 -left-60 size-[500px] rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl section-padding py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <Badge className="w-fit rounded-full border border-accent/50 bg-accent/20 text-accent-foreground px-4 py-1.5 text-xs font-semibold">
              🇵🇪 Plataforma regulada en Perú
            </Badge>

            <div className="flex flex-col gap-4">
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-foreground text-balance">
                Invierte en remates
                <br />
                <span className="relative inline-block">
                  judiciales
                  <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent/50 -z-10 rounded" />
                </span>{" "}
                con confianza.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Accede a propiedades inmobiliarias verificadas legalmente. Invierte desde{" "}
                <strong className="text-foreground font-semibold">S/ 500</strong> y genera
                retornos de hasta{" "}
                <strong className="text-foreground font-semibold">22% anual</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                asChild
                className="rounded-full h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base shadow-lg shadow-primary/25 group"
              >
                <Link href="/register">
                  Empezar a invertir
                  <ArrowRight className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full h-12 px-8 font-semibold text-base "
              >
                <Link href="#como-funciona">Ver cómo funciona</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="size-4 text-primary" />
                <span>Datos protegidos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="size-4 text-primary" />
                <span>Rentabilidad verificada</span>
              </div>
            </div>
          </motion.div>

          {/* Right: UI mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            {/* Floating card: investment dashboard */}
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Main card */}
              <div className="rounded-3xl bg-white border border-border/60 shadow-2xl shadow-foreground/8 p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                      <Gavel className="size-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mi portafolio</p>
                      <p className="text-sm font-semibold text-foreground">Activo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-2.5 py-1">
                    <div className="size-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-700">En línea</span>
                  </div>
                </div>

                {/* Balance */}
                <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
                  <p className="text-xs font-medium opacity-70 mb-1">Retorno acumulado</p>
                  <p className="text-3xl font-bold tracking-tight">S/ 8,420.50</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <TrendingUp className="size-3.5 opacity-80" />
                    <span className="text-xs font-medium opacity-80">+18.4% este año</span>
                  </div>
                </div>

                {/* Property cards mini */}
                <div className="flex flex-col gap-2">
                  {[
                    { name: "Apt. San Isidro 3B", status: "Activo", roi: "+21%", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=48&h=48&fit=crop" },
                    { name: "Casa Los Olivos", status: "Pendiente", roi: "+17%", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=48&h=48&fit=crop" },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img} alt={p.name} className="size-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.status}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{p.roi}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge: new property */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 rounded-2xl bg-white border border-border/60 shadow-xl p-3 flex items-center gap-3 w-52"
              >
                <div className="size-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <span className="text-lg">🏠</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Nueva subasta</p>
                  <p className="text-xs text-muted-foreground">Miraflores — S/ 280K</p>
                </div>
              </motion.div>

              {/* Floating badge: return */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="absolute -top-4 -right-4 rounded-2xl bg-white border border-border/60 shadow-xl p-3"
              >
                <p className="text-xs text-muted-foreground">Retorno promedio</p>
                <p className="text-lg font-bold text-foreground">22% <span className="text-green-600 text-sm">anual</span></p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 grid grid-cols-3 divide-x divide-border/60 rounded-2xl border border-border/60 bg-white/80 backdrop-blur-sm overflow-hidden"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-6 px-4 gap-1">
              <span className="text-2xl lg:text-3xl font-bold text-foreground">{s.value}</span>
              <span className="text-sm text-muted-foreground text-center">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
