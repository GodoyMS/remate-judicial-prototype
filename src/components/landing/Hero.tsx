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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANDING_HERO_VIDEO_SRC } from "@/lib/landing/media";

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
  { name: "María E.", amount: "S/ 1,500", ago: "hace 1 min", avatar: "ME", color: "bg-chart-1" },
  { name: "Carlos R.", amount: "S/ 3,000", ago: "hace 3 min", avatar: "CR", color: "bg-chart-2" },
  { name: "Sofía T.", amount: "S/ 800",   ago: "hace 6 min", avatar: "ST", color: "bg-chart-3" },
  { name: "Diego M.", amount: "S/ 5,000", ago: "hace 9 min", avatar: "DM", color: "bg-chart-4" },
];

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
    <section
      data-nav-tone="light"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* ── Video background ── */}
      <video
        className="absolute inset-0 size-full object-cover pointer-events-none"
        src={LANDING_HERO_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      {/* Scrim keeps copy readable over any frame of the video */}
      <div
        className="absolute inset-0 pointer-events-none bg-background/80 dark:bg-background/75"
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none bg-linear-to-b from-background/40 via-transparent to-background/70"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] section-padding py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 xl:gap-20 items-center">

          {/* ══════════════════════════════════════
              LEFT — copy
          ══════════════════════════════════════ */}
          <div className="flex flex-col gap-7">

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl xl:text-[3.75rem] font-extrabold leading-[1.07] tracking-tight text-foreground drop-shadow-sm">
                El mercado de{" "}
                <span className="text-primary">propiedades</span>
                <br />
                <span className="text-primary">en remate</span> más
                <br />
                <span className="text-primary">seguro</span> del Perú.
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
                className="rounded-full h-13 px-8 font-semibold text-base border-border/80 bg-background/60 backdrop-blur-sm hover:bg-muted/60"
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
            <div className="relative rounded-3xl bg-card border border-border/60 shadow-2xl shadow-foreground/10 overflow-hidden">

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
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-destructive text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <span className="relative flex size-1.5">
                    <span className="animate-ping absolute inline-flex size-full rounded-full bg-card opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-card" />
                  </span>
                  EN VIVO
                </div>

                {/* Countdown top-right */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-sm font-mono font-bold px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="size-3.5 text-warning" />
                  <span className="text-warning tabular-nums">
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
                  <div className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 rounded-lg px-2.5 py-1">
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
                        <span className="text-xs font-bold text-success">{inv.amount}</span>
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
              <div className="rounded-2xl bg-card border border-border/60 shadow-2xl p-4 w-52">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-7 rounded-lg bg-success flex items-center justify-center">
                    <TrendingUp className="size-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Mi portafolio</span>
                </div>
                <p className="text-2xl font-black text-foreground">S/ 8,420</p>
                <p className="text-[10px] text-success font-semibold flex items-center gap-0.5 mt-0.5">
                  <ChevronUp className="size-3" />
                  +18.4% este año
                </p>
                {/* Mini sparkline */}
                <svg viewBox="0 0 80 24" className="w-full mt-2 overflow-visible">
                  <polyline
                    points="0,20 12,16 24,14 36,10 48,12 60,6 72,4 80,2"
                    fill="none"
                    className="stroke-success"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="80" cy="2" r="3" className="fill-success" />
                </svg>
              </div>
            </FloatingPill>

            {/* ── Floating card: new property ── */}
            <FloatingPill
              delay={1.1}
              floatY={6}
              className="absolute -right-6 -bottom-6 hidden lg:block z-10"
            >
              <div className="rounded-2xl bg-card border border-border/60 shadow-2xl p-3 flex items-center gap-3 w-56">
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
                    <span className="size-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[9px] font-bold text-success uppercase">Nueva subasta</span>
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
              <div className="rounded-2xl bg-card border border-border/60 shadow-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* Stacked avatars */}
                  <div className="flex -space-x-2">
                    {["bg-chart-1", "bg-chart-3", "bg-chart-4"].map((c, i) => (
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
      </div>
    </section>
  );
}
