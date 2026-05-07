"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Gavel,
  MapPin,
  Clock,
  Users,
  Zap,
  ChevronUp,
  Star,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  ScaleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Animated counter hook ─── */
function useCounter(to: number, duration = 1.8, delay = 0.4) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const elapsed = (Date.now() - start) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setVal(Math.round(eased * to));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [to, duration, delay]);
  return val;
}

/* ─── Live countdown timer ─── */
function useCountdown(hours: number, minutes: number, seconds: number) {
  const [time, setTime] = useState({ h: hours, m: minutes, s: seconds });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) return prev;
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ─── Investor feed ─── */
const INVESTORS = [
  { name: "María E.", amount: "S/ 1,500", ago: "hace 1 min", avatar: "ME", color: "bg-blue-500" },
  { name: "Carlos R.", amount: "S/ 3,000", ago: "hace 3 min", avatar: "CR", color: "bg-emerald-500" },
  { name: "Sofía T.", amount: "S/ 800",   ago: "hace 6 min", avatar: "ST", color: "bg-purple-500" },
  { name: "Diego M.", amount: "S/ 5,000", ago: "hace 9 min", avatar: "DM", color: "bg-amber-500" },
];

/* ─── Background grid ─── */
function GridBackground() {
  return (
    <svg
      className="absolute inset-0 size-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/* ─── Floating pill ─── */
function FloatingPill({
  delay,
  className,
  children,
  floatY = 10,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
  floatY?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "backOut" }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -floatY, 0] }}
        transition={{ duration: 3.5 + delay * 0.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main hero ─── */
export function Hero() {
  const countdown = useCountdown(1, 47, 23);
  const investedCount = useCounter(48, 2.0, 0.6);
  const investorCount = useCounter(3200, 2.2, 0.7);
  const successCount = useCounter(94, 1.6, 0.8);

  const [feedIndex, setFeedIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFeedIndex((i) => (i + 1) % INVESTORS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  /* Bid progress animation */
  const bidProgress = useMotionValue(52);
  const bidWidth = useTransform(bidProgress, [0, 100], ["0%", "100%"]);
  useEffect(() => {
    const controls = animate(bidProgress, 67, { duration: 2.5, delay: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [bidProgress]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-background">
      {/* ── Rich background ── */}
      <GridBackground />
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm gradient blob top-right */}
        <div className="absolute -top-32 -right-32 size-[700px] rounded-full bg-accent/25 blur-[120px]" />
        {/* Cool gradient blob bottom-left */}
        <div className="absolute bottom-0 -left-48 size-[600px] rounded-full bg-primary/10 blur-[100px]" />
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] rounded-full bg-accent/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl section-padding py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 xl:gap-20 items-center">

          {/* ══════════════════════════════════════
              LEFT — copy
          ══════════════════════════════════════ */}
          <div className="flex flex-col gap-7">

            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-accent/40 px-4 py-1.5">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex size-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                </span>
                <span className="text-xs font-semibold text-foreground">
                  12 subastas activas ahora mismo
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                <span>🇵🇪</span>
                <span>Regulado · SBS Perú</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl xl:text-[3.75rem] font-extrabold leading-[1.07] tracking-tight text-foreground">
                El mercado de{" "}
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10">propiedades</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                    style={{ originX: 0 }}
                    className="absolute -bottom-1 left-0 right-0 h-3.5 bg-accent/60 -z-10 rounded-sm"
                  />
                </span>
                <br />
                en remate más
                <br />
                <span className="text-primary">transparente del Perú.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-md"
            >
              Compra participaciones en inmuebles adjudicados judicialmente.
              Verificados legalmente. Desde{" "}
              <strong className="text-foreground font-semibold">S/ 500</strong>.
              Retornos de hasta{" "}
              <strong className="text-foreground font-semibold">22% anual</strong>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                asChild
                className="rounded-full h-13 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base shadow-xl shadow-primary/30 group"
              >
                <Link href="/register">
                  Empezar a invertir
                  <ArrowRight className="size-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full h-13 px-8 font-semibold text-base border-border/80 hover:bg-muted/60"
              >
                <Link href="#como-funciona">¿Cómo funciona?</Link>
              </Button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-5 pt-1"
            >
              {[
                { icon: Shield, label: "Encriptación bancaria" },
                { icon: Star, label: "4.9/5 en Google" },
                { icon: Zap, label: "Alta demanda — únete hoy" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Icon className="size-3.5 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Live animated stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-3 gap-3 pt-2"
            >
              {[
                { value: `S/${investedCount}M+`, label: "subastados" },
                { value: `${investorCount.toLocaleString()}+`, label: "inversores" },
                { value: `${successCount}%`, label: "éxito" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-0.5 rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm px-4 py-3"
                >
                  <span className="text-xl font-black text-foreground tabular-nums">{s.value}</span>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ══════════════════════════════════════
              RIGHT — live auction panel
          ══════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="relative"
          >
            {/* ── Main auction card ── */}
            <div className="relative rounded-3xl bg-white border border-border/60 shadow-2xl shadow-foreground/10 overflow-hidden">

              {/* Property hero image */}
              <div className="relative h-56 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=450&fit=crop&auto=format"
                  alt="Penthouse Miraflores"
                  className="w-full h-full object-cover"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                {/* LIVE badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <span className="relative flex size-1.5">
                    <span className="animate-ping absolute inline-flex size-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                  </span>
                  EN VIVO
                </div>

                {/* Countdown top-right */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-sm font-mono font-bold px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="size-3.5 text-amber-400" />
                  <span className="text-amber-400 tabular-nums">
                    {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
                  </span>
                </div>

                {/* Property info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white font-bold text-lg leading-snug drop-shadow">
                        Penthouse en Miraflores
                      </p>
                      <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                        <MapPin className="size-3" />
                        <span>Calle Berlín 847 · 195 m²</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-xl bg-accent/90 backdrop-blur-sm px-2.5 py-1.5">
                      <TrendingUp className="size-3.5 text-accent-foreground" />
                      <span className="text-xs font-black text-accent-foreground">+22% ROI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auction data */}
              <div className="p-5 flex flex-col gap-4">

                {/* Bid info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Precio base</p>
                    <p className="text-base font-semibold text-foreground">S/ 280,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Oferta actual</p>
                    <motion.p
                      initial={{ scale: 0.9 }}
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ delay: 1.5, duration: 0.4 }}
                      className="text-xl font-black text-primary"
                    >
                      S/ 312,500
                    </motion.p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 rounded-lg px-2.5 py-1">
                    <ChevronUp className="size-3.5" />
                    +11.6%
                  </div>
                </div>

                {/* Bid progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                    <span>Participación cubierta</span>
                    <span className="font-semibold text-primary">67%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      style={{ width: bidWidth }}
                      className="h-full rounded-full bg-linear-to-r from-primary to-accent"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                    <span>S/ 187,375 participado</span>
                    <span>S/ 92,625 disponible</span>
                  </div>
                </div>

                {/* Investor feed */}
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Users className="size-3.5 text-muted-foreground" />
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Inversores activos — 23 participando
                    </p>
                  </div>

                  <div className="relative overflow-hidden h-8">
                    {INVESTORS.map((inv, i) => (
                      <motion.div
                        key={inv.name}
                        animate={{
                          y: i === feedIndex ? 0 : i === (feedIndex - 1 + INVESTORS.length) % INVESTORS.length ? -32 : 32,
                          opacity: i === feedIndex ? 1 : 0,
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center gap-2"
                      >
                        <div className={`size-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${inv.color}`}>
                          {inv.avatar}
                        </div>
                        <span className="text-xs text-foreground font-medium">{inv.name}</span>
                        <span className="text-xs text-muted-foreground">invirtió</span>
                        <span className="text-xs font-bold text-green-600">{inv.amount}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{inv.ago}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Expediente */}
                <div className="flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/15 px-3 py-2">
                  <Gavel className="size-3.5 text-primary shrink-0" />
                  <p className="text-xs text-foreground/70">
                    Exp. N° <strong className="text-foreground">2023-1847-LIMA</strong> · 3er Juzgado Civil
                  </p>
                </div>

                {/* CTA */}
                <Button
                  asChild
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm shadow-md shadow-primary/20 group"
                >
                  <Link href="/register">
                    Participar en esta subasta
                    <ArrowRight className="size-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* ── Floating card: portfolio return ── */}
            <FloatingPill
              delay={0.9}
              floatY={8}
              className="absolute -left-8 top-24 hidden xl:block z-10"
            >
              <div className="rounded-2xl bg-white border border-border/60 shadow-2xl p-4 w-52">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-7 rounded-lg bg-green-500 flex items-center justify-center">
                    <TrendingUp className="size-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Mi portafolio</span>
                </div>
                <p className="text-2xl font-black text-foreground">S/ 8,420</p>
                <p className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5 mt-0.5">
                  <ChevronUp className="size-3" />
                  +18.4% este año
                </p>
                {/* Mini sparkline */}
                <svg viewBox="0 0 80 24" className="w-full mt-2 overflow-visible">
                  <polyline
                    points="0,20 12,16 24,14 36,10 48,12 60,6 72,4 80,2"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="80" cy="2" r="3" fill="#16a34a" />
                </svg>
              </div>
            </FloatingPill>

            {/* ── Floating card: new property ── */}
            <FloatingPill
              delay={1.1}
              floatY={6}
              className="absolute -right-6 -bottom-6 hidden lg:block z-10"
            >
              <div className="rounded-2xl bg-white border border-border/60 shadow-2xl p-3 flex items-center gap-3 w-56">
                <div className="size-10 rounded-xl overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=80&h=80&fit=crop"
                    alt="nueva"
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-green-600 uppercase">Nueva subasta</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate">Dept. Barranco</p>
                  <p className="text-[10px] text-muted-foreground">S/ 165K · ROI +24%</p>
                </div>
              </div>
            </FloatingPill>

            {/* ── Floating badge: investors ── */}
            <FloatingPill
              delay={1.3}
              floatY={9}
              className="absolute -top-5 right-12 hidden lg:block z-10"
            >
              <div className="rounded-2xl bg-white border border-border/60 shadow-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* Stacked avatars */}
                  <div className="flex -space-x-2">
                    {["bg-blue-500", "bg-purple-500", "bg-amber-500"].map((c, i) => (
                      <div
                        key={i}
                        className={`size-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-[9px] font-bold text-white`}
                      >
                        {["M", "C", "S"][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">+19 inversores</p>
                    <p className="text-[10px] text-muted-foreground">en esta subasta</p>
                  </div>
                </div>
              </div>
            </FloatingPill>
          </motion.div>

        </div>

        {/* ── Bottom stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60 rounded-2xl border border-border/60 bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm"
        >
          {[
            { icon: <HomeIcon className="text-secondary"/>, value: `S/${investedCount}M+`, label: "en propiedades subastadas" },
            { icon: <UsersIcon className="text-secondary"/>, value: `${investorCount.toLocaleString()}+`, label: "inversores activos" },
            { icon:<ChartBarIcon className="text-secondary"/>, value: "22% anual", label: "retorno promedio" },
            { icon: <ScaleIcon className="text-secondary"/>, value: "100% legal", label: "verificado judicialmente" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 py-5 px-4 sm:px-6">
              <span className="bg-accent p-2 rounded-full">{s.icon}</span>
              <div>
                <p className="text-xl font-black text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
